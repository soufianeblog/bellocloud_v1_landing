# BelloCloud Infra — Engineering Blueprint

**Repo:** `bellocloud-infra` · **Doc version:** 1.0 · **Status:** authoritative
**Audience:** AI agent (and humans) building and operating BelloCloud's
infrastructure. This repo contains runbooks, configuration templates, CI
workflow templates, and inventory — **no application code**.

---

## How to use this document (agent instructions)

1. Read fully before acting. Work milestone by milestone (§12).
2. Everything in §13 (Out of scope) is forbidden.
3. Every runbook you write must contain: purpose, preconditions, steps,
   verification checklist, rollback. A runbook without verification is
   incomplete.
4. This repo never contains live secrets — placeholders + a pointer to the
   secret's storage location only.
5. The API repo consumes infrastructure ONLY via the Coolify REST API.
   Anything you build must preserve that boundary (§6).

---

## 0. Mission

Provide and operate the machines, network, and supply chain under
BelloCloud: the control-plane host (Server A), the Coolify orchestration
plane (Server B + workers), DNS/TLS, the private image registry and app
image pipeline, backups, monitoring, and disaster recovery — on Vultr +
Ubuntu LTS.

---

## 1. Platform constants (shared across all BelloCloud repos)

Same table as bellocloud-api §1 — duplicated verbatim there and in
bellocloud-front. Key infra-relevant entries: instance domain
`{subdomain}.apps.bellocloud.com`; app container port `8080`; health path
`/up`; statuses enum owned by the API.

---

## 2. Repo layout

    /docs/runbooks/        one file per runbook (§11 list)
    /docs/architecture.md  diagram + this doc's ADR log
    /inventory/servers.md  authoritative machine inventory (IPs, roles, specs)
    /inventory/dns.md      authoritative DNS record table
    /ci-templates/         GitHub Actions templates: app-image build,
                           api deploy, front deploy
    /image-contract/       IMAGE_CONTRACT.md + reference Dockerfile notes
    /firewall/             Vultr firewall group definitions (documented)
    /monitoring/           Uptime Kuma monitor list + alert routing
    DECISIONS.md           dated one-line ADRs

---

## 3. Server inventory & roles (Ubuntu 24.04 LTS everywhere)

| Role | Name | Sizing (start) | Runs | Notes |
|---|---|---|---|---|
| Control-plane host | **server-a** | existing box, 2–4GB | aaPanel: `api.bellocloud.com` (PHP 8.3 site, MySQL, Redis, Supervisor→Horizon, cron→scheduler) + `bellocloud.com` (static `dist/`) | Holds billing data → hardened per §9. |
| Orchestrator | **server-b** | 2GB / $12 | Coolify only. May temporarily co-live on worker-1 to save cost; migrating later is a documented runbook. | Never runs customer workloads. |
| Workers | **worker-1..n** | 8GB to start | Docker + Coolify proxy (Traefik) + customer containers & per-customer MySQL | No panels, no extra software. |
| Object storage | — | Vultr Object Storage bucket `bellocloud-backups` | S3-compatible backup target | Separate credentials, write-scoped. |

Capacity planning: one instance ≈ 250–400MB app + 350–500MB dedicated
MySQL ⇒ ~8–12 instances per 8GB worker. Trigger to add a worker: sustained
RAM > 75% or instance count at `max_instances`. `servers.max_instances`
in the API mirrors this; infra sets the number, API enforces placement.

---

## 4. Network, DNS & TLS

DNS (Cloudflare, zone `bellocloud.com`):

| Record | Type | Target | Proxy |
|---|---|---|---|
| `@`, `www` | A | server-a | Proxied |
| `api` | A | server-a | Proxied (or DNS-only if websockets/webhook quirks appear — record decision) |
| `*.apps` | A | worker-1 | **DNS-only** (Traefik must terminate TLS for Let's Encrypt HTTP-01) |
| `*.s2.apps` (pattern for worker N≥2) | A | worker-N | DNS-only |
| `coolify` | A | server-b | DNS-only |

Customer custom domains: customers CNAME → `{sub}.apps.bellocloud.com`
(DNS-only on their side if they use Cloudflare); certs issued by Traefik
automatically. Low TTLs (300s) on all A records for DR agility.

Firewall (Vultr firewall groups are the single source of truth; document
each group in `/firewall/`):

| Group | Inbound allowed |
|---|---|
| fw-server-a | 80,443 world · aaPanel custom port from admin IPs only · 22 from admin IPs |
| fw-server-b | 443 (Coolify UI/API behind `coolify.bellocloud.com`) from admin IPs **+ server-a IP** (the API calls it) · 22 from admin IPs · 8000 temporarily from admin IPs until the domain is configured, then closed |
| fw-workers | 80,443 world · 22 from server-b IP + admin IPs · nothing else (DB ports never public) |

---

## 5. Coolify plane

Setup (runbook `coolify-setup.md`): install current Coolify on server-b →
admin account + 2FA → attach `coolify.bellocloud.com` + SSL to the
dashboard, close port 8000 → add each worker via generated SSH key
(Coolify installs Docker + proxy) → set worker **wildcard domain**
(`https://apps.bellocloud.com`, or `https://sN.apps.bellocloud.com` for
worker N) → add registry pull credentials (§6) → create API token scoped
read+write+deploy and hand to the API team via the secrets process (§9) →
enable Coolify's own instance backup.

Worker onboarding (runbook `worker-onboarding.md`): create Vultr instance
in fw-workers → add to Coolify → set wildcard → verify → deploy a
throwaway test app from the registry and confirm HTTPS on a subdomain →
register the server in the platform (admin API: name, ip,
coolify_server_uuid, wildcard_domain, max_instances) → delete test app.

Resilience fact to preserve in all designs: **Coolify being down does not
stop customer containers** — Traefik and containers run independently on
workers; Coolify is only needed for changes.

---

## 6. Contracts

**Provides — Provisioning contract (consumed by bellocloud-api):**
`COOLIFY_URL=https://coolify.bellocloud.com` + a read/write/deploy token;
guarantee that every active worker is registered (UUID matches the API's
`servers` table), has the wildcard domain configured, has working
pull-only registry credentials, and that the Coolify endpoint is
HTTPS-only and IP-allowlisted to server-a + admins. Version pinning:
record the running Coolify version in DECISIONS.md; coordinate upgrades
with the API team (their endpoint paths are pinned per version).

**Provides — Image contract (`/image-contract/IMAGE_CONTRACT.md`,
authoritative for every marketplace app):** the image listens on **8080**;
is configured entirely by env vars (`APP_KEY, APP_URL, APP_ENV=production,
DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, MAIL_*` plus the
app's `env_schema` keys); runs its own DB migrations safely/idempotently
on boot; serves `GET /up` returning 200 when healthy; logs to stdout;
trusts upstream proxies; requires no shell access, no build step at
deploy, no host mounts beyond its declared storage volume; tagged
semver (`1.4.2`) plus `latest`; linux/amd64.

**Consumes:** nothing from the other repos except deploy artifacts
(api release, front `dist/`) via the CI pipelines below.

---

## 7. Registry & app-image pipeline

Start on **GHCR private** (org-scoped): one repo per marketplace app.
Tokens: CI gets write; Coolify gets a **read-only** pull token; both
rotated quarterly (runbook `token-rotation.md`). Documented later
migration path to self-hosted Harbor if pull volume/cost demands.

CI template (`/ci-templates/app-image.yml`), one instantiation per app
repo: trigger on version tag → build multi-stage image per the image
contract → smoke-test container boots and `/up` responds → push
`app:x.y.z` + `latest` → notify (the API's `apps.current_tag` is updated
by an admin, deliberately manual in v1 — rollout is a product action, not
a CI side effect).

---

## 8. Control-plane hosting & deploy pipelines (Server A)

aaPanel sites: `api.bellocloud.com` — PHP 8.3 (+ required extensions),
dedicated MySQL DB + user, Redis from App Store, Supervisor program
running Horizon, cron running the scheduler, SSL; webroot points at the
release's `public/`. `bellocloud.com` — static site serving the front
`dist/` (SPA fallback to `index.html` for non-prerendered paths; correct
cache headers: hashed assets immutable, HTML no-cache).

Pipelines (`/ci-templates/`): **api-deploy** — on main: tests → build →
zero-downtime release over SSH (Deployer-style symlinked releases,
`migrate --force`, Horizon terminate/restart, rollback = previous
symlink). **front-deploy** — on main: tests → build + prerender → rsync
`dist/` to the static site root. Deploy SSH key is restricted to server-a
and stored per §9.

---

## 9. Security baseline & secrets

All servers: SSH keys only (password auth off), unattended-upgrades on,
Vultr firewall as source of truth (host firewall optional duplicate),
NTP sane, admin IP list maintained in `/inventory`. Server A extra:
aaPanel on non-default port + IP-restricted, panel 2FA, MySQL bound
locally. Workers: nothing installed manually — if a worker needs a
one-off human action, it goes through Coolify's terminal and gets a
DECISIONS.md entry. Secrets policy: live values exist only in (a) the
password manager and (b) the consuming server's `.env`/CI secrets; this
repo stores `*.example` placeholders + storage pointers; quarterly
rotation runbook covers Coolify token, registry tokens, S3 keys, deploy
key.

---

## 10. Backups, monitoring, DR

**Backups:** Coolify scheduled backup on every customer MySQL → S3 bucket
(daily, 14–30d retention, per-instance prefix). Control-plane MySQL
(server-a): nightly dump → same bucket, separate prefix + credentials.
Coolify instance backup weekly. **A restore is tested quarterly and
logged** (runbook `restore-test.md`) — an untested backup is not a backup.

**Monitoring:** Uptime Kuma (container on server-b): monitors for
`bellocloud.com`, `api.bellocloud.com` health endpoint, Coolify UI,
each worker (TCP 443), registry reachability, and one canary customer
instance per worker. Per-instance health is the API's job (hourly
`/up` sweep + auto-restart); infra alerts on the machines. Alert channel:
email + one push channel (Telegram/ntfy). Basic host metrics: Netdata or
`node_exporter`+Grafana on workers — pick one, record in DECISIONS.md.

**DR scenarios (runbook each):**

| Scenario | Response | Target |
|---|---|---|
| Worker loss | New worker via onboarding runbook → restore each instance's latest DB dump → API admin re-points instances (server row swap + reprovision) → wildcard/per-record DNS update | RTO hours, RPO ≤ 24h |
| Server B (Coolify) loss | Customer apps keep running (§5). Reinstall Coolify, restore its backup or re-register workers, reissue API token | No customer downtime |
| Server A loss | Rebuild aaPanel sites, redeploy api from repo + latest DB dump, front from CI artifact; DNS TTL 300 helps | RTO hours, RPO ≤ 24h |

---

## 11. Runbook index (each per the format in agent instruction 3)

`coolify-setup · worker-onboarding · worker-drain-and-remove ·
registry-setup · token-rotation · server-a-hardening · api-deploy-rollback ·
front-deploy-rollback · backup-restore-test · dr-worker-loss ·
dr-coolify-loss · dr-server-a-loss · dns-change · coolify-upgrade ·
capacity-review (monthly)`

---

## 12. Milestones & definition of done

| # | Milestone | Definition of done |
|---|-----------|--------------------|
| I1 | Plane online | DNS table live; firewall groups applied; Coolify installed + hardened behind its domain; worker-1 onboarded with wildcard; **a manually deployed test app serves HTTPS on a subdomain**. |
| I2 | Supply chain | GHCR private repos + tokens issued (write→CI, read→Coolify); app-image CI template merged; first real app image tagged, pushed, and deployed via Coolify from the registry; IMAGE_CONTRACT.md published; Coolify API token delivered to API team. |
| I3 | Control-plane hosting | Both server-a sites live with SSL; Horizon under Supervisor verified surviving reboot; api-deploy and front-deploy pipelines executed end-to-end incl. one rollback drill; server-a hardening checklist complete. |
| I4 | Resilience | All backup jobs writing to S3 and verified; monitoring + alerting live (test alert received); first restore test executed and logged. |
| I5 | Scale & DR | worker-2 onboarded via runbook alone (no improvisation); per-worker wildcard scheme proven; all three DR runbooks tabletop-tested; token rotation performed once; capacity review scheduled. |

---

## 13. Out of scope — hard boundaries (do NOT build)

- No application/business code; no changes inside bellocloud-api or
  bellocloud-front beyond consuming their build artifacts.
- No Kubernetes, no Terraform/Ansible in v1 (documented manual runbooks
  first; automation is a later, explicit decision).
- No panels (aaPanel or otherwise) on workers or server-b; no manual
  `docker run` on workers outside a break-glass runbook entry.
- No DNS or provisioning actions on behalf of the API at runtime — the
  API self-serves through Coolify; infra only guarantees the contract.
- No secrets committed anywhere in this repo, ever.