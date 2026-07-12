# BelloCloud API — Engineering Blueprint

**Repo:** `bellocloud-api` · **Doc version:** 1.0 · **Status:** authoritative
**Audience:** AI coding agent implementing this repository from scratch.

---

## How to use this document (agent instructions)

1. Read the entire document before writing anything.
2. Implement milestone by milestone (§14), in order. Do not start a milestone
   before the previous one's definition-of-done passes.
3. Everything in §15 (Out of scope) is forbidden. Do not add it "helpfully".
4. Where this doc is silent, choose the most idiomatic Laravel 13 solution and
   document the decision in `DECISIONS.md` (one bullet per decision).
5. All external systems (Coolify, Stripe, PayPal, DNS) are consumed **only**
   through the contracts in §7. Never bypass them.
6. No UI is built in this repo. This is a headless JSON API.

---

## 0. Mission

BelloCloud is a self-hosted SaaS marketplace ("hosting-provider style"):
customers sign up, pick an app (proprietary Laravel+TanStack ERP products),
pay a subscription, and receive an isolated running instance (own container,
own MySQL database, own subdomain or custom domain) on BelloCloud's worker
servers. This repo is the **control-plane API**: the single source of truth
for users, catalog, billing, and instance lifecycle. It orchestrates the
data plane exclusively through the Coolify REST API.

---

## 1. Platform constants (shared across all BelloCloud repos)

| Constant            | Value                                                    |
|---------------------|----------------------------------------------------------|
| Marketing/portal    | `https://bellocloud.com` (repo: bellocloud-front)        |
| This API            | `https://api.bellocloud.com`                             |
| Customer instances  | `https://{subdomain}.apps.bellocloud.com`                |
| Locales             | `en` (default), `ar` (RTL)                               |
| Instance statuses   | `pending, provisioning, running, past_due, suspended, terminating, terminated, failed` |
| Subdomain rule      | regex `^[a-z0-9](-?[a-z0-9]){2,30}$`, lowercase, unique platform-wide, not in reserved list (`www, api, admin, mail, app, apps, status, docs, cdn, ftp, smtp, billing, portal, support`) |
| App container port  | `8080` (image contract, §7.3)                            |
| Health endpoint     | `GET /up` on every customer instance                     |

These constants are duplicated in the front and infra blueprints. If one
changes, all three documents change.

---

## 2. Stack & conventions

- **Runtime:** Laravel 13, PHP 8.3, MySQL 8 (production), Redis (queues,
  cache, sessions), Horizon for queue supervision.
- **Auth:** Laravel Fortify (headless) + Sanctum SPA cookie mode.
  `SESSION_DOMAIN=.bellocloud.com`, stateful domain `bellocloud.com`.
- **Tests:** Pest 4. Test DB = SQLite `:memory:`. Every migration must run on
  both MySQL and SQLite (no raw MySQL-only DDL).
- **Structure:** domain modules under `app/Domains/{Auth,Catalog,Billing,
  Instances,Provisioning,Servers,Admin,Notifications}`. Each module owns its
  models, actions, jobs, events, listeners, policies, requests, resources.
- **Conventions:** thin controllers → single-purpose Action classes; Form
  Requests for validation; API Resources for all output; PHP enums for all
  statuses/types; money stored as integer minor units + currency; every
  externally-triggered side effect is an Event with queued Listeners; strict
  types everywhere; Larastan level 8 in CI.
- **API style:** versioned prefix `/v1`. Responses: `{ "data": ..., "meta": ... }`.
  Errors: RFC 7807-style `{ "message", "errors": {field: []} }` (Laravel
  default is acceptable). Cursor or page pagination via `meta`. Localized
  catalog content selected by `Accept-Language` (fallback `en`).
- **Docs:** OpenAPI generated automatically (Scramble or Scribe) and committed
  to `openapi.json` on every CI run — this file is the contract consumed by
  bellocloud-front (§7.1).

---

## 3. Domain modules

| Module        | Responsibility                                                                 |
|---------------|--------------------------------------------------------------------------------|
| Auth          | Register, login, logout, email verification, password reset, 2FA (TOTP), profile, locale preference. |
| Catalog       | Apps and plans, EN/AR translatable content, `env_schema` definition, public read endpoints, admin CRUD. |
| Billing       | `BillingProvider` contract with Stripe (Cashier) and PayPal (Subscriptions API) implementations; checkout/session creation; webhook ingestion; invoice listing; billing-portal links. Maps provider events → internal lifecycle events. |
| Instances     | Instance aggregate + state machine (§5). Only place allowed to mutate `instances.status`. Emits domain events on every transition. |
| Provisioning  | Coolify HTTP client (contract-bound, §7.2) + all queued jobs (§9) + health checks. The ONLY module that talks to Coolify. |
| Servers       | Worker registry, capacity, placement policy: choose active server with the fewest non-terminated instances where `count < max_instances`; error if none available. |
| Admin         | Thin controllers over the same domain services, gated by `admin` ability + 2FA-enabled requirement. Metrics aggregation (MRR, counts by status, per-server load). Impersonation (issue short-lived impersonation session, fully audited). |
| Notifications | Transactional mail: verify email, instance ready, payment failed, instance suspended, cancellation confirmed, domain verified. Queued, localized (en/ar). |

---

## 4. Data model

Cashier's standard tables (`subscriptions`, `subscription_items`) are added by
its migrations. Platform tables:

**users** — Fortify + Cashier columns; `name, email, password, locale
(en|ar), is_admin bool, two_factor_* , stripe_id, pm_type, pm_last_four`.

**apps** — `slug (unique), status (draft|published|archived), is_free bool,
docker_image (e.g. ghcr.io/bello/erp), current_tag, min_ram_mb int,
name/tagline/description/features (translatable JSON), screenshots JSON,
env_schema JSON, sort int`.

**plans** — `app_id FK, code, name (translatable), monthly_price int,
currency, stripe_price_id nullable, paypal_plan_id nullable, trial_days int,
limits JSON (seat/record caps enforced in-app), is_active, sort`.

**servers** — `name, ip, coolify_server_uuid, wildcard_domain
(apps.bellocloud.com), max_instances int, active bool`.

**instances** — `user_id FK, app_id FK, plan_id FK, server_id FK nullable,
subdomain (unique), status enum (§1), image_tag,
coolify_project_uuid / coolify_app_uuid / coolify_db_uuid (nullable),
db_name, db_user, secrets (encrypted JSON: db_password, app_key,
env answers), health_failures int default 0, provisioned_at, suspended_at,
terminate_after (date, set on cancellation), timestamps, soft deletes`.

**instance_domains** — `instance_id FK, domain (unique), status
(pending|verifying|active|failed), is_primary bool, verified_at`.

**deployments** — audit log: `instance_id FK, action
(provision|deploy|suspend|resume|terminate|domain|health_restart),
status (queued|running|success|failed), coolify_deployment_uuid nullable,
payload JSON, error text, timestamps`.

**env_schema shape** (data contract with front):
```json
[
  { "key": "COMPANY_NAME", "type": "text", "required": true,
    "label": { "en": "Company name", "ar": "اسم الشركة" } },
  { "key": "DEFAULT_CURRENCY", "type": "select", "required": true,
    "options": ["USD","EUR","SAR"], "label": { "en": "...", "ar": "..." } }
]
```
Allowed types: `text, email, select, boolean, number`. Answers are validated
against this schema, stored in `instances.secrets`, injected as env vars.

---

## 5. Instance state machine

Single authoritative transition table. Any transition not listed throws.
Every applied transition writes a `deployments` row and fires
`InstanceStatusChanged`.

| From         | Event / trigger                                   | To           |
|--------------|---------------------------------------------------|--------------|
| —            | Deploy flow started (order created)               | pending      |
| pending      | Payment confirmed (or app is free)                | provisioning |
| pending      | Checkout abandoned > 24h (scheduled cleanup)      | terminated   |
| provisioning | Health check passed                               | running      |
| provisioning | Provision job exhausted retries                   | failed       |
| failed       | Admin retry action                                | provisioning |
| running      | Payment failed webhook                            | past_due     |
| past_due     | Payment recovered webhook                         | running      |
| past_due     | Grace period exceeded (7 days, scheduled)         | suspended    |
| running      | Admin manual suspend                              | suspended    |
| suspended    | Payment recovered / admin resume                  | running      |
| running      | Subscription cancelled (webhook or user)          | terminating  |
| past_due     | Subscription cancelled                            | terminating  |
| suspended    | Subscription cancelled or retention hit           | terminating  |
| terminating  | Teardown job finished (after final backup)        | terminated   |

Retention: `terminate_after = cancellation + 14 days`; user may resume
(re-subscribe) any time before teardown runs.

---

## 6. API surface (`/v1`)

### Public (no auth, localized, cache-friendly, rate-limited)
| Method | Path                    | Purpose                                  |
|--------|-------------------------|------------------------------------------|
| GET    | /apps                   | Published apps, localized cards          |
| GET    | /apps/{slug}            | App detail + plans + env_schema          |
| GET    | /meta/sitemap           | URL set for front's sitemap build        |
| POST   | /contact                | Contact form (throttled + honeypot)      |

### Auth (Fortify routes, Sanctum cookie)
`POST /auth/register · /auth/login · /auth/logout · /auth/forgot-password ·
/auth/reset-password · email verification · 2FA enable/confirm/challenge ·
GET /auth/me · PATCH /auth/profile (name, locale, password)`

### Portal (auth:sanctum + verified)
| Method | Path                                      | Purpose |
|--------|-------------------------------------------|---------|
| GET    | /instances                                | List own instances (poll-friendly) |
| POST   | /instances                                | Start deploy: app, plan, subdomain, env answers → `pending` instance; returns checkout payload (§8) or provisions immediately if free |
| GET    | /instances/{id}                           | Detail incl. status, url, version, domains |
| POST   | /instances/{id}/restart                   | Restart running instance (throttled) |
| DELETE | /instances/{id}                           | Cancel: cancels subscription at period end → terminating flow |
| GET    | /instances/{id}/deployments               | Own audit trail |
| POST   | /instances/{id}/domains                   | Add custom domain → verification flow |
| GET    | /instances/{id}/domains                   | List + statuses + CNAME instructions |
| DELETE | /instances/{id}/domains/{domainId}        | Remove custom domain |
| GET    | /instances/{id}/backups                   | List backups (via provisioning module) |
| POST   | /instances/{id}/backups                   | Trigger manual backup (throttled) |
| POST   | /billing/checkout                         | Create Stripe Checkout session for pending instance |
| POST   | /billing/paypal/subscribe                 | Create PayPal subscription approval link |
| GET    | /billing/portal                           | Stripe billing-portal URL |
| GET    | /billing/invoices                         | Unified invoice list |

Subdomain availability: validate within `POST /instances` (422 with
suggestion) — no separate public availability endpoint (enumeration risk).

### Admin (auth + `admin` ability + 2FA)
CRUD/actions over: `users` (list, detail, disable, impersonate),
`apps` (CRUD + translations + env_schema + publish + `rollout` action =
DeployVersion for all instances of app), `plans` (CRUD + `sync-to-stripe`),
`instances` (list all w/ filters + suspend/resume/retry/redeploy/terminate),
`servers` (CRUD + drain toggle), `deployments` (global log),
`metrics` (MRR, instance counts by status, per-server load).

### Webhooks (public, signature-verified, idempotent by event id)
`POST /webhooks/stripe · POST /webhooks/paypal`

---

## 7. Contracts

### 7.1 Provides — API contract (consumed by bellocloud-front)
- `openapi.json` committed and current on every merge; front generates TS
  types from it. Breaking changes require a `/v1` deprecation note first.
- Auth is cookie-based (Sanctum): front calls `/sanctum/csrf-cookie` then
  session endpoints; CORS allows `https://bellocloud.com` with credentials.
- Localization: `Accept-Language: en|ar` affects catalog + notification
  content, never enum values.

### 7.2 Consumes — Provisioning contract (guaranteed by bellocloud-infra)
- Env: `COOLIFY_URL`, `COOLIFY_TOKEN` (read+write+deploy).
- Infra guarantees: workers pre-registered in Coolify (UUIDs match `servers`
  table), wildcard domain configured per worker, private-registry pull
  credentials installed, Coolify reachable only over HTTPS + IP-allowlisted.
- API uses only these Coolify capabilities: create project · create MySQL
  database · create application from private docker image · bulk set env
  vars · start/stop/restart/delete application & database · read deployment
  status/logs · trigger DB backup. Endpoint paths are verified against the
  live Coolify version at milestone M3 start and pinned in `DECISIONS.md`
  (Coolify is beta software; do not trust memorized paths).

### 7.3 Relies on — Image contract (guaranteed by app images, documented in infra)
Every marketplace app image: listens on `8080`; configured entirely by env
vars (`APP_KEY, APP_URL, APP_ENV=production, DB_HOST, DB_PORT, DB_DATABASE,
DB_USERNAME, DB_PASSWORD, MAIL_*` + `env_schema` keys); runs its own
migrations safely on boot; exposes `GET /up`; logs to stdout; needs no shell
access ever.

---

## 8. Billing flows

**Provider abstraction:** `BillingProvider` interface — `createCheckout,
cancelAtPeriodEnd, resume, invoiceList, verifyWebhook, mapEvent`. Lifecycle
code depends on the interface only.

**Stripe (primary, via Cashier):** one subscription per instance, name
`app-{instance_id}`, metadata `instance_id`. Checkout Session flow; billing
portal for card/invoice self-service.

**PayPal:** Subscriptions API; `plans.paypal_plan_id` created by the
plan-sync admin action; approval-link flow; webhook signature verification
per PayPal spec.

**Webhook → lifecycle mapping (both providers normalize to):**

| Normalized event        | Stripe source                          | PayPal source                        | Action |
|-------------------------|----------------------------------------|--------------------------------------|--------|
| payment_confirmed       | checkout.session.completed / invoice.paid (first) | BILLING.SUBSCRIPTION.ACTIVATED | pending → provisioning (dispatch ProvisionInstance) |
| payment_failed          | invoice.payment_failed                 | PAYMENT.SALE.* failure / SUSPENDED   | running → past_due + notify |
| payment_recovered       | invoice.paid (while past_due)          | PAYMENT.SALE.COMPLETED (while past_due) | past_due/suspended → running (ResumeInstance) |
| subscription_cancelled  | customer.subscription.deleted          | BILLING.SUBSCRIPTION.CANCELLED       | → terminating (schedule teardown at retention) |

Webhook handlers must be idempotent (store processed event ids) and must
never mutate status directly — they emit normalized events consumed by the
Instances state machine.

---

## 9. Provisioning jobs (module: Provisioning)

Global rules: every job is queued on Horizon, idempotent (safe re-run),
`WithoutOverlapping` keyed by instance id, `tries=3` with backoff, writes a
`deployments` row (running → success/failed), and on final failure
transitions per §5 + notifies admin.

| Job                  | Trigger                          | Steps (via Coolify contract) |
|----------------------|----------------------------------|------------------------------|
| ProvisionInstance    | payment_confirmed / free deploy  | pick server (placement policy) → create project → create MySQL (name/user/password from instance) → create app from `docker_image:image_tag` with domain `https://{sub}.apps.bellocloud.com`, port 8080 → bulk env vars (image contract + secrets) → start app → dispatch HealthGate |
| HealthGate           | after provision/deploy/resume    | poll instance `/up` (max ~10 tries, 15s apart) → success: status per machine + "instance ready" mail; failure: mark failed/alert |
| DeployVersion        | admin rollout / single redeploy  | patch image tag → start → HealthGate; rollout = batched dispatch over all running instances of app |
| SuspendInstance      | grace exceeded / admin           | stop app + stop DB (volumes persist) → suspended + notify |
| ResumeInstance       | payment_recovered / admin        | start DB → start app → HealthGate |
| TerminateInstance    | terminate_after reached / admin  | trigger final DB backup → delete app → delete DB → delete project → terminated; release subdomain; purge secrets |
| VerifyCustomDomain   | domain added (repeating)         | resolve CNAME → target; on match: append domain to Coolify app domains + restart (Traefik issues cert) → active + notify; give up after 72h → failed |
| InstanceHealthCheck  | hourly schedule                  | for running instances: probe /up; 1st failure → restart + log; 2nd consecutive → alert admin |

---

## 10. Scheduled tasks

`SuspendPastDue` daily (past_due > 7d → SuspendInstance) ·
`RunTerminations` daily (terminate_after ≤ now → TerminateInstance) ·
`CleanupAbandonedPending` hourly (pending > 24h, unpaid → terminated) ·
`InstanceHealthCheck` hourly · `VerifyCustomDomain` re-dispatch every 10 min
for `verifying` domains · Horizon snapshot · queue/failed-job pruning.

---

## 11. Security requirements

Sanctum cookie SPA auth; strict CORS (front origin only, credentials);
throttling on auth, contact, checkout, restart, backup endpoints; encrypted
casts for `instances.secrets`; webhook signature verification (both
providers) + event-id idempotency; admin ability + enforced 2FA for all
`/admin` routes; impersonation fully audited (who, whom, when, ip);
policies on every model (users see only their own instances/domains/
invoices); no Coolify token or internal UUIDs ever serialized in API
resources; secrets never logged; audit `deployments` rows immutable.

---

## 12. Environment configuration (`.env` keys this app requires)

`APP_*` standard · `DB_*` (MySQL) · `REDIS_*` · `SESSION_DOMAIN=
.bellocloud.com` · `SANCTUM_STATEFUL_DOMAINS=bellocloud.com` ·
`FRONTEND_URL=https://bellocloud.com` · `COOLIFY_URL` · `COOLIFY_TOKEN` ·
`STRIPE_KEY/SECRET/WEBHOOK_SECRET` · `CASHIER_CURRENCY` ·
`PAYPAL_MODE/CLIENT_ID/SECRET/WEBHOOK_ID` · `MAIL_*` ·
`APPS_WILDCARD_DOMAIN=apps.bellocloud.com` · `INSTANCE_GRACE_DAYS=7` ·
`INSTANCE_RETENTION_DAYS=14`.

---

## 13. Testing requirements (Pest 4, SQLite :memory:)

- **State machine:** exhaustive test asserting every legal transition
  succeeds and every illegal one throws (table-driven from §5).
- **Provisioning:** Coolify client faked at HTTP layer (`Http::fake`);
  each job tested for the exact call sequence, idempotent re-run, and
  failure path. No test may hit a real network.
- **Billing:** recorded Stripe/PayPal webhook payloads replayed against the
  endpoints; signature failure, duplicate event id, and each mapping row of
  §8 asserted.
- **Policies/authz:** cross-user access attempts on every portal endpoint
  return 403/404; admin routes reject non-admin and non-2FA users.
- **Validation:** subdomain rule + reserved list; env answers vs env_schema.
- **CI gates:** Pest green, Larastan level 8, Pint clean, `openapi.json`
  regenerated with no uncommitted diff.

---

## 14. Milestones & definition of done

| # | Milestone | Definition of done |
|---|-----------|--------------------|
| M1 | Foundations | Repo scaffolded per §2; Fortify+Sanctum cookie auth working incl. 2FA; users migration; CI (Pest, Larastan, Pint, OpenAPI) green; Horizon running locally. |
| M2 | Catalog | Apps/plans models + translations + env_schema; public endpoints localized (en/ar) with tests; admin CRUD endpoints; seeders with 2 demo apps. |
| M3 | Money path (MVP) | `POST /instances` → Stripe checkout → webhook → ProvisionInstance → HealthGate → running; free-app path; instance list/detail live; Coolify endpoints verified & pinned; full fake-Coolify test coverage. |
| M4 | Lifecycle | All §5 transitions reachable; suspend/resume/terminate + retention; scheduled tasks (§10); notifications (§ Notifications) localized; restart endpoint. |
| M5 | Admin | Full §6 admin surface incl. metrics, rollout action, plan→Stripe sync, impersonation with audit. |
| M6 | Growth | Custom-domain flow end to end; PayPal provider complete incl. webhooks; backups list/trigger; health-check auto-restart; hardening pass on §11. |

---

## 15. Out of scope — hard boundaries (do NOT build)

- No HTML views, Blade pages, Livewire, Inertia, or **Filament**. Mail
  templates are the only rendered views.
- No SSH, no Docker SDK, no shell exec, no direct DNS record management
  (DNS lookups for domain verification are allowed). Coolify REST is the
  only infrastructure interface.
- No frontend assets, no npm, no Vite in this repo.
- No multi-tenancy inside customer apps, no changes to the app images —
  that's the image contract's problem, not this repo's.
- No payment logic outside the Billing module; no status mutation outside
  the Instances state machine; no Coolify calls outside Provisioning.
- No Kubernetes, no Terraform, no server provisioning — bellocloud-infra
  owns machines.