# BelloCloud Front — Engineering Blueprint

**Repo:** `bellocloud-front` · **Doc version:** 1.0 · **Status:** authoritative
**Audience:** AI coding agent implementing this repository from scratch.

---

## How to use this document (agent instructions)

1. Read the entire document before writing anything.
2. Implement milestone by milestone (§13), in order. Do not start a milestone
   before the previous one's definition-of-done passes.
3. Everything in §14 (Out of scope) is forbidden. Do not add it "helpfully".
4. Where this doc is silent, choose the most idiomatic TanStack/React solution
   and log it in `DECISIONS.md` (one bullet per decision).
5. The API (`bellocloud-api`) is the ONLY backend. Its committed
   `openapi.json` is the contract; never invent endpoints, never call
   third-party providers directly.
6. This repo contains no server-side business logic and no secrets.

---

## 0. Mission

The complete web frontend of BelloCloud: the public marketing/marketplace
site (SEO-critical, EN/AR), the customer portal (deploy, manage, and pay for
isolated app instances), and the internal admin area. One SPA codebase,
strictly typed against the API's OpenAPI contract.

---

## 1. Platform constants (shared across all BelloCloud repos)

| Constant            | Value                                                    |
|---------------------|----------------------------------------------------------|
| This app            | `https://bellocloud.com`                                 |
| API base            | `https://api.bellocloud.com` (`/v1`)                     |
| Customer instances  | `https://{subdomain}.apps.bellocloud.com`                |
| Locales             | `en` (default, LTR), `ar` (RTL)                          |
| Instance statuses   | `pending, provisioning, running, past_due, suspended, terminating, terminated, failed` |
| Subdomain rule      | regex `^[a-z0-9](-?[a-z0-9]){2,30}$`, reserved list enforced by API — front mirrors the regex for instant UX validation only; API is authoritative |
| Auth                | Sanctum SPA cookies on `.bellocloud.com` (no tokens, ever) |

If a constant changes, all three repo blueprints change.

---

## 2. Stack & conventions

- **Build:** Vite, npm. TypeScript strict mode, no `any` outside generated code.
- **Routing:** TanStack Router (file-based routes plugin, typed params/search).
- **Server state:** TanStack Query v5. **Client state:** local component state
  first; a tiny Zustand store only for session + UI (locale, dir, toasts).
- **UI:** shadcn/ui + Tailwind. RTL-safe by construction: logical utilities
  only (`ms-* me-* ps-* pe-* start-* end-* text-start/end`); `ml-/mr-/pl-/pr-`
  are banned by an ESLint rule added in M1.
- **Forms:** react-hook-form + zod resolvers. Zod schemas mirror API
  validation messages; server 422 errors are mapped back onto fields.
- **i18n:** react-i18next; dictionaries in `src/locales/{en,ar}.json`;
  `Intl.*` for all dates/numbers/currency; no hardcoded UI strings anywhere
  (ESLint rule / i18n lint in CI).
- **API layer:** types generated from the API repo's `openapi.json` via
  openapi-typescript into `src/api/schema.d.ts` (npm script `api:types`,
  refreshed in CI). A single fetch client: `credentials: include`, CSRF
  bootstrap via `GET /sanctum/csrf-cookie`, `X-XSRF-TOKEN` header on
  mutations, `Accept-Language` from active locale, central handling of
  401 (redirect to login with return path), 419 (refresh CSRF, retry once),
  403/404 (error boundary pages), 5xx (toast + retry affordance).
- **Testing:** Vitest browser mode + Testing Library + MSW (handlers typed
  from the same OpenAPI schema). Playwright smoke suite only in M6.
- **Quality gates (CI):** tsc --noEmit, ESLint (incl. logical-props + i18n
  rules), Vitest, build, prerender step succeeds.

---

## 3. Rendering & SEO strategy (decided)

Pure CSR SPA **plus build-time prerender of all public routes**:

- A post-build prerender step renders every public route in both locales
  (`/en/...`, `/ar/...`) to static HTML in `dist/` — landing, marketplace,
  every published app page (slugs fetched from `GET /v1/meta/sitemap` at
  build time), pricing, legal, contact. Crawlers get full HTML + meta;
  users get instant SPA hydration.
- `sitemap.xml` and `robots.txt` are generated in the same step from the
  same API feed (all locale alternates included).
- Portal (`/app/*`) and admin (`/admin/*`) are never prerendered and carry
  `noindex`.
- Approved alternative (only if explicitly requested later): migrate public
  routes to TanStack Start SSR. Do not do this preemptively.

Per-route head management: each public route defines `title`,
`description`, canonical, `hreflang` alternates (en/ar/x-default),
OpenGraph/Twitter tags, and JSON-LD (`SoftwareApplication` on app pages,
`Organization` + `WebSite` on the landing).

---

## 4. Route map

Locale prefix applies to public routes only. Portal/admin are unprefixed;
their language follows the authenticated user's `locale` preference.

### Public — `/$locale/...` (locale validated: en|ar; bare `/` redirects by
Accept-Language, default en)
| Route | Screen intent |
|---|---|
| `/` | Landing: hero, value props, featured apps, how-it-works, pricing teaser, CTA. |
| `/apps` | Marketplace grid: localized app cards (name, tagline, from-price, free badge), category/search filter (client-side). |
| `/apps/$slug` | App detail: gallery, localized description/features, plan cards, FAQ, primary CTA → deploy wizard (or login first). |
| `/pricing` | All plans across apps, comparison layout. |
| `/about`, `/contact`, `/legal/terms`, `/legal/privacy` | Static/localized; contact posts to `POST /v1/contact`. |

### Auth (unprefixed, redirect to `/app` when already authenticated)
`/login · /register · /forgot-password · /reset-password · /verify-email ·
/two-factor` — all against the API's Fortify endpoints; register captures
locale; verify-email gate before portal access.

### Portal — `/app/*` (guard: authenticated + verified)
| Route | Screen intent |
|---|---|
| `/app` | Dashboard: instance cards (status badge, app icon, subdomain link, plan), empty state → marketplace CTA. |
| `/app/deploy/$slug` | Deploy wizard (§6). |
| `/app/instances/$id` | Tabbed detail — **Overview** (status timeline, open-app button, version, subdomain, created), **Domains** (add custom domain, CNAME instructions, per-domain status chips, remove), **Backups** (list, trigger manual — throttled state), **Billing** (current plan, invoices for this instance, cancel with confirm dialog explaining retention, resume if terminating), **Settings** (restart button, env answers view, danger zone), **Activity** (deployments audit list). |
| `/app/billing` | Account-level: unified invoices, "Manage payment methods" → API-provided Stripe billing-portal URL (external redirect). |
| `/app/settings` | Profile, password, 2FA enroll/disable (QR + recovery codes), language switch (persists to API, flips dir live). |

### Admin — `/admin/*` (guard: `is_admin`; API additionally enforces 2FA)
| Route | Screen intent |
|---|---|
| `/admin` | Metrics: MRR, active instances, instances-by-status chart, per-server load bars, recent failures feed. |
| `/admin/users` (+detail) | Table (search/sort/paginate), detail with instances + invoices, disable, **impersonate** (persistent warning banner + exit while active). |
| `/admin/apps` (+editor) | List + editor: EN/AR side-by-side translation fields, screenshots manager, env_schema builder (add/reorder fields of the 5 allowed types with per-locale labels), versions panel (current tag, set new tag, **Roll out to all instances** with confirm + progress), publish toggle. |
| `/admin/plans` | CRUD per app, "Sync to Stripe" action with result feedback. |
| `/admin/instances` | Global table: filters (status/app/server/user), row actions suspend/resume/retry/redeploy/terminate (typed confirm for terminate), drawer with deployment log viewer. |
| `/admin/servers` | List: capacity used/max, active/drain toggle, add-server form (fields per API). |
| `/admin/deployments` | Global audit log, filterable. |

System routes: 403, 404, 500 error boundaries; global loading via router
pending UI; every list screen defines loading (skeleton), empty, and error
states explicitly.

---

## 5. Data layer conventions

- Query keys: `['session'] · ['apps', locale] · ['apps', locale, slug] ·
  ['instances'] · ['instances', id] · ['instances', id, 'domains'|'backups'|
  'deployments'] · ['invoices'] · ['admin', <resource>, filters]`.
- Session (`GET /v1/auth/me`) loads in the root route's `beforeLoad` into
  router context; guards read context, redirect unauthenticated → `/login?
  redirect=...`, non-admin → 403.
- Polling: while any owned instance is in `pending/provisioning/terminating`
  (or any domain `verifying`), refetch the relevant queries every 5s; stop
  on settle. No websockets in v1.
- Mutations invalidate their domain keys; destructive actions use
  AlertDialog confirms; optimistic updates only for trivial toggles.
- Status badge mapping (single shared component): pending=neutral,
  provisioning=blue+spinner, running=green, past_due=amber, suspended=amber
  outline, terminating=red outline, terminated=muted, failed=red.

---

## 6. Deploy wizard (`/app/deploy/$slug`) — the money path

Stepper, state kept in a single wizard store, forward-only with back-edit:

1. **Plan** — plan cards from app detail; preselect via `?plan=` search param.
2. **Subdomain** — input with live regex validation, suffix
   `.apps.bellocloud.com` preview; availability is confirmed only by the API
   at submit (422 → inline error + suggestion shown).
3. **Configure** — dynamic form rendered from the app's `env_schema`
   (text/email/select/boolean/number; required flags; localized labels).
4. **Payment** — summary (app, plan, price, trial if any). Paid:
   `POST /v1/instances` → receive checkout payload → redirect to Stripe
   Checkout (hosted) — or PayPal approval link when user picks PayPal (M6).
   Free: `POST /v1/instances` provisions immediately → step 5.
5. **Provisioning** — return/success screen polls the instance: staged
   progress (queued → creating database → deploying app → health check) from
   status + latest deployment record; success → confetti-free, calm "Open
   your app" CTA; failure → apologetic state, support link, admin is already
   alerted server-side.

Abandoned checkout: wizard warns that unpaid setups expire in 24h (API
cleans up).

---

## 7. i18n & RTL requirements

- URL locale on public routes; `<html lang>` + `<html dir>` switch
  (`dir=rtl` for ar) at router level; portal/admin follow user preference.
- All shadcn compositions must render correctly in RTL (icons/chevrons
  flip via logical placement, not manual transforms except where a
  direction-semantic icon requires `rtl:rotate-180`).
- Arabic-capable font stack loaded conditionally; line-height tuned for
  Arabic script.
- Language switcher on public header (rewrites current route to other
  locale) and in portal settings (persists via `PATCH /v1/auth/profile`).
- Currency/date rendering via `Intl` with locale; Arabic uses Western
  numerals for prices (consistency with invoices).

---

## 8. Design system notes

shadcn defaults + a small token layer (brand primary, radius) defined once
in CSS variables; light theme only in v1 (dark mode is out of scope).
Density: marketing pages generous, portal/admin compact. Tables via
TanStack Table wrapped in one shared DataTable component (sorting,
pagination, empty/error states) used by all admin screens.

---

## 9. Contracts

**Consumes — API contract:** `openapi.json` from bellocloud-api is the sole
source of endpoint truth; regenerate types on every CI run and fail the
build on drift. Cookie auth flow exactly as §2. `Accept-Language` sent on
every request.
**Never:** direct calls to Stripe/PayPal/Coolify or any third party.
The only provider touchpoints are full-page redirects to URLs the API
returns (Stripe Checkout, Stripe billing portal, PayPal approval).
**Provides:** nothing — this repo is a pure consumer.

---

## 10. Environment configuration

`VITE_API_URL=https://api.bellocloud.com` ·
`VITE_APPS_DOMAIN=apps.bellocloud.com` ·
`VITE_SITE_URL=https://bellocloud.com` (canonical/prerender base).
No provider keys exist in this repo. `.env.example` committed.

---

## 11. Testing requirements

- MSW handlers for every consumed endpoint, response shapes typed from the
  OpenAPI schema; happy + error variants.
- Component/flow tests (Vitest browser mode): full auth flows incl. 2FA
  challenge and guard redirects; deploy wizard end-to-end against MSW incl.
  env_schema renderer covering all 5 field types, subdomain validation UX,
  free vs paid branch, 422 mapping; instance detail tab behaviors (cancel
  confirm, restart throttle state, domain add + CNAME display); admin
  DataTable actions with confirms; impersonation banner.
- RTL: at least one rendering test per major layout asserting `dir=rtl`
  and logical-property layout (no horizontal overflow).
- i18n: missing-key detection test fails CI; both locale bundles load.
- M6 only: Playwright smoke of the real money path against staging.

---

## 12. Performance & accessibility budgets

Public routes: Lighthouse ≥ 90 perf/SEO/a11y on the prerendered output;
route-level code splitting (marketing bundle must not include portal/admin
chunks); images lazy + sized. Portal: interactions < 100ms perceived
(skeletons, optimistic where safe). Keyboard navigable dialogs/menus
(shadcn defaults preserved), focus management on route change, form errors
announced.

---

## 13. Milestones & definition of done

| # | Milestone | Definition of done |
|---|-----------|--------------------|
| F1 | Foundations | Scaffold per §2; typed API client + generated types pipeline; session context + guards; auth screens incl. 2FA; EN/AR bootstrap with dir switching; layout shells (public/portal/admin); CI gates green. |
| F2 | Public site | All §4 public routes localized both locales; head/meta/JSON-LD per route; prerender + sitemap + robots produced in build; Lighthouse budgets met. |
| F3 | Money path (MVP) | Deploy wizard complete against API M3 (Stripe + free paths); dashboard + instance overview with polling; "Open app" works; wizard test suite green. |
| F4 | Lifecycle UX | Billing tab + account billing + portal-link redirect; past_due/suspended banners and resume flows; restart; settings incl. language persistence; notifications toasts. |
| F5 | Admin | Every §4 admin screen functional against API M5, incl. env_schema builder, rollout action with progress, impersonation UX, metrics dashboard. |
| F6 | Growth | Custom-domains tab (CNAME guidance, live verification status); PayPal branch in wizard + billing; backups tab; a11y/perf pass; Playwright smoke. |

---

## 14. Out of scope — hard boundaries (do NOT build)

- No SSR/Node runtime beyond the build-time prerender script; no TanStack
  Start migration unless explicitly instructed.
- No direct Stripe/PayPal/Coolify SDKs or requests; no provider keys.
- No auth tokens in localStorage/sessionStorage; cookies only.
- No business rules client-side (pricing math, status transitions, plan
  limits — display only what the API returns).
- No physical CSS direction utilities (`ml/mr/pl/pr/left/right` positional
  spacing), no hardcoded user-facing strings, no second UI kit, no Redux.
- No dark mode, no websockets, no PWA/offline in v1.
- No admin capability that lacks a corresponding API endpoint.