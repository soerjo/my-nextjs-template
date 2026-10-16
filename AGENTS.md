<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `bun run dev` — dev server (port 3000)
- `bun run build` — production build
- `bun run lint` — ESLint flat config (`eslint.config.mjs`, extends `core-web-vitals` + `typescript`)
- `bunx tsc --noEmit` — type check (no dedicated script)
- No test framework is configured

## Stack

- Next.js 16 (App Router only), React 19, TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss` — CSS-first config in `src/app/globals.css` (`@import "tailwindcss"` + `@theme` design tokens)
- shadcn/ui (Radix base) — primitives in `src/components/ui`, theme tokens in `src/app/globals.css`
- TanStack React Query wired up via `src/providers/query-provider.tsx` (staleTime: 60s, no refetch on focus)
- Dummy API Mode: Set `NEXT_PUBLIC_DUMMY_MODE="true"` to mock all auth API requests with 200 success responses and simulated 300-500ms delay without backend hits.

## Architecture

Feature-based folder structure under `src/`:
- `src/features/` — domain modules (auth, home, …). Each feature owns its components, hooks, services, and types.
- `src/components/` — shared: `ui/` (base/reusable), `layouts/` (app shell)
- `src/lib/` — api-client (with token refresh), query-keys factory
- `src/providers/` — client-side context providers (QueryProvider, etc.)
- `src/types/` — shared TypeScript types
- `src/utils/` — pure utility functions (`cn`)
- `src/config/` — app config derived from env vars
- `src/constants/` — static values (routes, API paths)
- `src/app/` — Next.js App Router. Route groups: `(marketing)/`, `(auth)/`, `(dashboard)/`.

Every module directory has a barrel `index.ts` — import via `@/features/home/components`, not deep paths.

## Path alias

`@/*` maps to `src/` (set in `tsconfig.json` paths).

## Style

- Font: Geist (sans + mono), loaded via `next/font/google` in `src/app/layout.tsx`
- `<html>` has `h-full antialiased`; `<body>` has `min-h-full flex flex-col`
- Use `cn()` from `@/utils` for conditional classNames
- Use `AppLink` from `@/components/ui` for navigation links (handles internal vs external automatically)

## Package manager

Bun only. Run scripts with `bun run <script>` and binaries with `bunx`.

## Auth System

See `AUTH_SYSTEM.md` for complete auth architecture (JWT, token refresh, API client with automatic auth headers, auth events).

<!-- BEGIN:heroui-to-shadcn-migration -->
## HeroUI → shadcn/ui migration checklist

Bounded, ordered checklist for the full HeroUI v3 → shadcn/ui migration. Bun only (never npm). Keep every step independently verifiable.

- [x] **1. Setup shadcn & remove HeroUI**
  - [x] `bunx shadcn@latest init` (Next.js App Router, Tailwind v4, alias `@/*`, CSS at `src/app/globals.css`) — done non-interactively as `bunx --bun shadcn@latest init -y -b radix -p nova` (`-b neutral` is invalid in current CLI: `-b` now selects base lib `radix|base|aria`; preset `nova` = Geist font + neutral baseColor, matches repo)
  - [x] `bunx shadcn@latest add button card input label` (default registry) — done as `bunx --bun shadcn@latest add -y button card input label`
  - [x] Confirm no duplicate `cn` utility; keep `src/utils/index.ts` and align aliases from init — `components.json` `utils` alias set to `@/utils`; generated `src/lib/utils.ts` deleted; new shadcn components rewritten to `import { cn } from "@/utils"`; cn now `clsx + tailwind-merge` (`tailwind-merge` added via bun; unused `cn` package removed; `shadcn` dependency kept)
  - [x] Remove `@heroui/react` and `@heroui/styles` from `package.json` — via `bun remove`
  - [x] Update `bun.lock` via Bun install
  - [x] Remove `@import "@heroui/styles";` from `src/app/globals.css`
  - [x] Confirm shadcn CSS variables exist (`background`, `foreground`, `primary`, `muted`, `muted-foreground`, `destructive`, `border`) — `:root`/`.dark` blocks written by init
  - [x] Delete dead `tailwind.config.js` — also set `components.json` tailwind `config` to `""`
  - [!] Verify: `test ! -f tailwind.config.js` [x] passed, `bunx shadcn@latest info` [x] passed, `bun install --frozen-lockfile` [x] passed, `bun run lint` [x] passed — `bunx tsc --noEmit` [!] blocked by design: 7 files still importing `@heroui/react` (steps 2–3 not yet migrated); only TS2307 errors, no other type errors

- [x] **2. Migrate shared UI components**
  - [x] Migrate `src/components/ui/password-input.tsx` to shadcn `Label`/`Input`/input-group primitives — used `Label` + `Input` + `Button` (`size="icon-sm"`, ghost) with lucide-react `Eye`/`EyeOff` replacing the inline SVGs
  - [x] Preserve `react-hook-form` integration, visibility toggle, `required`, `description`, and error state (`aria-invalid`)
  - [x] Migrate `src/components/layouts/app-header.tsx` to shadcn `Button`
  - [x] Map `onPress` → React handler, `isDisabled` → `disabled`, keep ghost/small/logout/loading behavior — `Spinner` → `Loader2` (lucide) with `animate-spin`
  - [x] Apply token mapping: `text-default-400`→`text-muted-foreground`, `text-danger`→`text-destructive`, `text-primary`→`text-primary`, `bg-danger-50`/`border-danger-*`/`text-danger-*`→semantic `destructive` tokens
  - [x] Verify: no `@heroui/react` imports remain in these files; `bun run lint` passed; `bunx tsc --noEmit` — only remaining TS2307 errors are from step 3 files (auth forms + `use-auth.tsx`), no other type errors

- [x] **3. Migrate auth forms & route guards**
  - [x] Migrate `login-form.tsx`, `register-form.tsx`, `forgot-password-form.tsx`, `reset-password-form.tsx` — all on shadcn `Card`/`CardHeader`/`CardContent`/`Input`/`Label`/`Button` + lucide `Loader2`
  - [x] Migrate `src/features/auth/hooks/use-auth.tsx` — `Spinner` → `Loader2` (`animate-spin`, `size-8`) in `ProtectedRoute`/`GuestRoute`
  - [x] Swap `Card`/`CardHeader`/`CardContent`/`Input`/`Button` to shadcn equivalents — raw `label` fields replaced with shadcn `Label`
  - [x] Map `variant="primary"`→shadcn default, `fullWidth`→`w-full`, `isDisabled`→`disabled`, replace `Spinner`
  - [x] Preserve Zod validation, RHF behavior, redirects, success/error states — `zodResolver`, `handleSubmit`, error callout, redirect and success states unchanged
  - [x] Apply semantic tokens (muted help text, destructive errors, primary links; drop manual `dark:` overrides) — callouts use `bg-destructive/10 border-destructive/30 text-destructive`; `aria-invalid` added to Inputs; dead `text-success` token mapped to `text-primary`
  - [x] Update stale HeroUI mention in `src/features/home/components/home-hero.tsx` — now says shadcn/ui
  - [x] Verify: `bun run lint` passed; `bunx tsc --noEmit` 0 errors; `rg '@heroui' src/` and legacy token classes (`text-default-400`/`text-danger`/`text-success`/`variant="primary"`/`fullWidth`/`isDisabled`/`Spinner`) clean across src

- [x] **4. Dockerfile to Bun**
  - [x] Switch `deps` + `builder` stages to `oven/bun:1`
  - [x] `deps`: copy `package.json` + `bun.lock`, run `bun install --frozen-lockfile`
  - [x] `builder`: reuse deps `node_modules`, keep `NEXT_PUBLIC_*` args, run `bun run build`
  - [x] Keep `runner` as `node:22-alpine` (standalone, non-root, port, `node server.js`)
  - [x] Remove all `package-lock.json`, `npm ci`, `npm run` references — `rg 'npm|package-lock' Dockerfile` clean
  - [!] Verify: `docker build -t my-nextjs-template .` — deferred to parent (step 5 verification)

- [x] **5. Final verification**
  - [x] `bun install --frozen-lockfile`, `bun run lint`, `bunx tsc --noEmit`, `bun run build` — lint exit 0, tsc 0 errors, build success (`.next/BUILD_ID` present)
  - [x] `docker build -t my-nextjs-template .` — exit 0
  - [x] Smoke-test login/register/forgot/reset (valid + invalid token), password toggle, disabled state on loading, `ProtectedRoute`/`GuestRoute` redirects, light/dark tokens — standalone run on `PORT=3100` returned 200 on `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`; docker run returned 200 on `/` and `/login`
  - [x] Audit: no `@heroui/*` in `package.json`/`bun.lock`, no `@heroui/react` imports, no `@import "@heroui/styles"`, no `tailwind.config.js` — all clean
  - [x] Audit: Dockerfile free of npm references; `bun.lock` is the only lockfile — clean
<!-- END:heroui-to-shadcn-migration -->

<!-- BEGIN:template-improvements -->
## Template improvements checklist

Bounded, ordered checklist for 11 UI-only frontend improvements. Context: all API calls go to an external BE service; tokens live in `localStorage`; shadcn/ui + Tailwind v4 CSS-first; Bun only (never npm). Validate each step independently before moving on.

- [x] **1. Fix `src/lib/api-client.ts` empty-response parsing**
  - [x] Add a `parseResponse` helper that returns `undefined` for `204 No Content` / empty / non-JSON bodies instead of calling `response.json()` — added `parseResponse<T>` returning `undefined` on 204 / `content-length: 0` / non-JSON content-type / empty or unparseable body
  - [x] Apply helper in `request<T>()` success path and in `refreshAccessToken()` (refresh response must still read tokens from JSON) — both use `parseResponse`; refresh reads `data?.data?.accessToken` from the typed JSON shape
  - [x] `ApiError` should read a `message` from a JSON error body when present, falling back to raw text/status text — added `parseErrorMessage` (tries `message`/`error`, falls back to raw text, then `statusText`/status code); used at both `ApiError` throw sites
  - [x] Keep existing 401 → refresh → retry flow and `auth:unauthorized` event behavior unchanged — refresh/subscriber/event logic untouched
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors (manual 204/error-body check deferred to runtime; no test framework yet)

- [x] **2. `queryKeys` factory consistency**
  - [x] Replace inline `["auth", "verify"]` in `src/features/auth/providers/login-provider.tsx` and `auth-provider.tsx` with `queryKeys.auth.verify` — both now import `queryKeys` from `@/lib` and use the factory
  - [x] Extend `src/lib/query-keys.ts` with per-feature namespaces as needed (auth verify/refresh, home, …) following the existing `as const` pattern — added `auth.all` + `auth.logout` alongside existing `auth.verify` / `home.all`
  - [x] Keep all invalidations/`useQuery` keys sourced from the factory (no string literals) — invalidation key is identical (`["auth","verify"]`), prefix matching unchanged
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors; `rg '"auth", "verify"' src/` only matches the factory definition in `query-keys.ts`

- [x] **3. Semantic token cleanup (remove hardcoded `zinc-*` / manual `dark:`)**
  - [x] `src/components/layouts/app-header.tsx` → `border-border`, `text-muted-foreground`, `hover:text-foreground`, `bg-background` — header border → `border-border`, nav link → `text-muted-foreground hover:text-foreground`
  - [x] `src/components/layouts/app-footer.tsx` → `border-border`, `text-muted-foreground`
  - [x] `src/features/home/components/home-hero.tsx` → `bg-background`, `text-foreground`, `text-muted-foreground`
  - [x] `src/app/(main)/page.tsx` → `bg-background` — used `bg-muted/50` (was `bg-zinc-50 dark:bg-black`); `HomeHero` uses `bg-background` (was `bg-white dark:bg-black`)
  - [x] Verify: `rg 'zinc-|dark:' src/components/layouts src/features/home src/app/\\(main\\)` clean (exit 1); `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors — also migrated the 4 `src/app/(auth)/*/page.tsx` route wrappers (`bg-zinc-50 dark:bg-black` → `bg-muted/50`) so `rg 'zinc-' src/` is now globally empty (exit 1)

- [x] **4. Update stale info in `AGENTS.md`**
  - [x] Replace HeroUI stack lines with shadcn/ui description; remove `@import "@heroui/styles"` mention — Stack now lists shadcn/ui (Radix) + Tailwind v4 CSS-first
  - [x] Remove non-existent `formatDate` from `src/utils/` description (keep `cn`)
  - [x] Update Commands to Bun (`bun run dev|build|lint`, `bunx tsc --noEmit`) and note test framework status after item 10 — commands switched to Bun; `No test framework is configured` retained (accurate until item 10)
  - [x] Update Package manager section to Bun-only; prune stale-config notes that are no longer true — Bun-only wording; removed `tailwind.config.js` (deleted), `next.config.js` (only `.ts` exists) and `.eslintignore` (absent) from stale list, kept `.eslintrc.json`
  - [x] Verify: `rg 'heroui|formatDate|next.config.js' AGENTS.md` returns only intentional/historical references — remaining matches are the migration checklist (historical) and this step's own verify line

- [x] **5. App Router boundaries (error/global-error/not-found/loading)**
  - [x] Add `src/app/error.tsx` (client, `reset()` retry button via shadcn `Button`, semantic tokens) — rendered with `retry` (stable since v16.3.0, preferred over `reset`), logs via `useEffect`, shows `error.message` fallback
  - [x] Add `src/app/global-error.tsx` (client, renders `<html><body>`, minimal + semantic tokens) — also imports `./globals.css` itself (Boundaries replace the root layout, so styles must be self-contained)
  - [x] Add `src/app/not-found.tsx` (shadcn `Button` link home) — server component, `AppLink` styled via `buttonVariants()` (avoids nested interactive elements)
  - [x] Add `src/app/loading.tsx` (lightweight skeleton/spinner, semantic tokens) — centered `Loader2` (`animate-spin`, `text-muted-foreground`)
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success (`/_not-found` route prerendered); no hardcoded colors (rg audit clean)

- [x] **6. `next.config.ts` rewrites + relative `apiClient` baseUrl**
  - [x] Add `rewrites()` mapping `/api/:path*` → `${process.env.API_PROXY_TARGET}/:path*` (server-side env, NOT `NEXT_PUBLIC_`) — fallback `http://localhost:3000` when unset; `rg 'API_PROXY_TARGET' src/` empty (not exposed to client)
  - [x] Change `ApiClient` default constructor `baseUrl` from `NEXT_PUBLIC_API_URL` to `/api` (relative) — now `process.env.NEXT_PUBLIC_API_URL || "/api"`: defaults to the relative `/api` proxy, env var kept only as an explicit direct-URL override (`||` so an empty value still falls back to `/api`)
  - [x] Ensure token refresh also uses the relative `/api` path — `refreshAccessToken()` builds from `this.baseUrl` + `API_ROUTES.refreshToken` unchanged
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success — `API_ROUTES` are relative (`/api/...`), so `/api` + `/api/:path*` rewrite round-trips to the BE target; documented in `.env.example` (server-only `API_PROXY_TARGET`, optional `NEXT_PUBLIC_API_URL` override)

- [x] **7. Env validation fail-fast with zod (`src/config`)**
  - [x] Add a zod schema for server-side env (`API_PROXY_TARGET`, app env) parsed in `src/config/index.ts` — schema: `NEXT_PUBLIC_APP_NAME` (default "My App"), `NEXT_PUBLIC_APP_URL` (`z.url()`, default `http://localhost:3000`), `NEXT_PUBLIC_API_URL` (optional string), `API_PROXY_TARGET` (`z.url()` optional); `z.url()` used (`.url()` on strings is deprecated in zod 4)
  - [x] Fail fast on invalid/missing required vars with a clear error — `parseErrorMessage`-style `throw` with `z.prettifyError` output
  - [x] Ensure server-only validation does not leak into / break the client bundle (no `NEXT_PUBLIC_*`-only import into client, correct `typeof window` / `server-only` guard) — throw guarded by `typeof window === "undefined"` (server-only fail-fast); on client failure falls back to `envSchema.parse({})` defaults so the client bundle never breaks
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success; `appConfig` typed from parsed env (`apiProxyTarget`, `appName` added), `AppConfig` export preserved

- [x] **8. CI workflow `.github/workflows/ci.yml`**
  - [x] Trigger on `push` and `pull_request` — `push` scoped to `main`, plus all `pull_request`
  - [x] Steps: install (Bun, frozen lockfile) → `bun run lint` → `bunx tsc --noEmit` → `bun run build` — `actions/checkout@v4` + `oven-sh/setup-bun@v2` (`bun-version: latest`); build env supplies `NEXT_PUBLIC_*` placeholders
  - [x] Provide required `NEXT_PUBLIC_*` / build env vars via workflow env or placeholders — `NEXT_PUBLIC_APP_NAME` / `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_API_URL=""` on the build step
  - [x] Optional lightweight `docker build` job (no push) — `docker/setup-buildx-action@v3` + `docker/build-push-action@v6` with `push: false`, `needs: checks`, GHA cache
  - [x] Verify: workflow YAML lint (`python3 -c yaml.safe_load` OK); no `npm` references; `bun install --frozen-lockfile` succeeds locally with same steps

- [x] **9. `next-themes` + theme toggle in `AppHeader`**
  - [x] Add `next-themes` (Bun) and wrap app in `ThemeProvider` (attribute `class`, `suppressHydrationWarning` on `<html>`) — `next-themes@0.4.6` via `bun add`; `ThemeProvider` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`) added in `src/providers/index.tsx`; `<html suppressHydrationWarning>` already present in `src/app/layout.tsx`
  - [x] Add a toggle in `src/components/layouts/app-header.tsx` handling hydration/mount safely, using shadcn `Button` + lucide icons — ghost `Button` (`size="icon-sm"`) with `Sun`/`Moon`; gated by `useIsMounted()` (placeholder `Sun` + `disabled` until mounted) so SSR/first render match
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success (8/8 static pages prerendered)

- [x] **10. Vitest + RTL smoke tests for auth forms**
  - [x] Add Vitest + `@testing-library/react` + jsdom via Bun; add `test` script and minimal config — `bun add -d vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom`; `"test": "vitest run"` (non-watch); `vitest.config.ts` (react plugin, jsdom env, `@` alias, setup file) + `vitest.setup.ts` (jest-dom matchers + RTL `cleanup()` in `afterEach`) — `@types/testing-library__jest-dom` omitted after installation: it is a deprecated empty stub that breaks `tsc` (TS2688), and jest-dom v7 ships its own types via `@testing-library/jest-dom/vitest`
  - [x] Smoke test one auth form (e.g. `login-form.tsx`): renders fields, validates required input, submit path (mock `apiClient`/providers) — `src/__tests__/smoke.test.tsx` (example-pattern, not full coverage): LoginForm renders "Sign In" heading + email field (`@/features/auth/hooks` mocked with a `useLogin` stub); PasswordInput toggles input type password↔text via the eye button; AppHeader renders logout button (hooks + `next-themes` mocked)
  - [x] Verify: `bun run test` passes (3/3), `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors (vitest config type-safe)

- [x] **11. Husky + lint-staged pre-commit**
  - [x] Add `husky` + `lint-staged` via Bun; `prepare` script; `pre-commit` hook — `bun add -d husky lint-staged prettier`; `"prepare": "husky"`; `bunx husky` initialized `.husky/_` (hooksPath `.husky/_`); `.husky/pre-commit` runs `bunx lint-staged`
  - [x] `lint-staged` runs ESLint (and Prettier if configured) on staged files only — `package.json` `lint-staged`: `*.{ts,tsx}` → `eslint --fix` then `prettier --write`
  - [x] Verify: a commit with a lint error is blocked; a clean commit succeeds; `bun install` re-installs hooks — real commit with a `@typescript-eslint/no-explicit-any` error was blocked (`husky - pre-commit script failed (code 1)`); a clean commit succeeded; test file removed and tree restored
<!-- END:template-improvements -->

<!-- BEGIN:upgrade-priorities -->
## Upgrade priorities P0-P2

Bounded, ordered checklist from the P0/P1/P2 upgrade-priority analysis. Bun only (never npm). Keep every step independently verifiable. Do not start any step until its dependencies are complete.

Ordering note: P1.2 (port legacy ESLint rules) MUST be completed before or alongside P0.2 (delete `.eslintrc.json`), so no rules are lost.

- [x] **P0.1 Add `bun run test` to CI checks job**
  - [x] Insert a test step in `.github/workflows/ci.yml` under the `checks` job, after type check and before `bun run build` — added `Test` step (`run: bun run test`) between `Type check` and `Build`
  - [x] Step runs `bun run test` (non-watch `vitest run` from `package.json`)
  - [x] Verify: `bun run test` passes locally (3/3); workflow YAML lints (`python3 -c yaml.safe_load`) clean

- [x] **P1.2 Port essential legacy ESLint rules into `eslint.config.mjs` (DO FIRST, before P0.2)**
  - [x] Read `.eslintrc.json` in full to inventory its rules, plugins, extends, and overrides — inventoried: `no-console`, `react/jsx-uses-react`, `react-hooks/exhaustive-deps`, `jsx-a11y/*` (2), `prettier/prettier`, `unused-imports/*`, `@typescript-eslint/no-unused-vars`, `import/order`, `react/self-closing-comp`, `react/jsx-sort-props`, `padding-line-between-statements`
  - [x] Port any rules not already implied by `core-web-vitals` + `typescript` into `eslint.config.mjs` (flat config) — ported `no-console`, `react/jsx-uses-react`, `react-hooks/exhaustive-deps`, the two `jsx-a11y` rules, `@typescript-eslint/no-unused-vars`, plus the legacy formatters
  - [x] Drop rules that are obsolete or superseded by the flat config — dropped `prettier/prettier` (Prettier via lint-staged) and `unused-imports/*` (plugin not installed; covered by `@typescript-eslint/no-unused-vars`); set purely stylistic high-volume rules (`import/order`, `react/jsx-sort-props`, `padding-line-between-statements`, `react/self-closing-comp`) to `"off"` after they produced ~240 auto-fixable warnings with no correctness value
  - [x] Verify: `bun run lint` exit 0 (3 meaningful `no-console` warnings ≤ 10; ran `eslint --fix` first, then downgraded chatty rules); `bunx tsc --noEmit` 0 errors; `bun run test` passes (3/3)

- [x] **P0.2 Remove stale config files**
  - [x] Consolidate any relevant variables from `example.env.local` into `.env.example` first — `rg` found none of `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`/`NEXT_PUBLIC_BACKEND_URL` referenced in code (only in `example.env.local` itself); documented `NEXT_PUBLIC_BACKEND_URL` with a consistent 2-line comment noting it is not read by the app, and listed the unused `GOOGLE_*` vars as commented-out deprecated entries
  - [x] Delete `example.env.local` — removed
  - [x] Delete `.eslintrc.json` (only after P1.2 rules are ported) — removed; P1.2 rules already ported into `eslint.config.mjs`
  - [x] Update `AGENTS.md` "Stale config files" note if it still references `.eslintrc.json` — entire "Stale config files (ignore these)" section removed (no longer referenced anywhere)
  - [x] Verify: `.env.example` documents all needed vars; `bun run lint` exit 0 (3 `no-console` warnings); `bunx tsc --noEmit` 0 errors; both files confirmed gone via `ls`

- [x] **P1.1 Vitest coverage setup**
  - [x] Install `@vitest/coverage-v8` via Bun (`bun add -d @vitest/coverage-v8`) — installed `@vitest/coverage-v8@5.0.4` (matches `vitest@^5.0.4`)
  - [x] Add coverage config to `vitest.config.ts` (provider `v8`, sensible reporters/thresholds) — `provider: 'v8'`, reporters `['text', 'html']`, includes `src/**/*.{ts,tsx}`, excludes tests/types/barrels/`app`/`providers`; thresholds set just below current smoke-test coverage (`lines` 8, `statements` 8, `functions` 12, `branches` 10) so the template's floor is enforced without going red
  - [x] Add a `test:coverage` script to `package.json` — `"test:coverage": "vitest run --coverage"`
  - [x] Verify: `bun run test:coverage` produces a report; `bunx tsc --noEmit` 0 errors — coverage report emitted (text summary + `coverage/index.html`, `coverage/` gitignored); `bunx tsc --noEmit` 0 errors; `bun run lint` exit 0 (same 3 pre-existing `no-console` warnings)

- [x] **P1.3 Update `@types/node` to `^22`**
  - [x] Bump `@types/node` to `^22` via Bun — `bun add -d '@types/node@^22'` → `@types/node@22.20.5`
  - [x] Verify: `bun install` clean, `bunx tsc --noEmit` 0 errors, `bun run build` success — `bun install --frozen-lockfile` no changes; `tsc` exit 0; build compiled, 8/8 static pages prerendered

- [x] **P2.1 Minor/patch dependency bumps via `bun update`**
  - [x] Run `bun update` scoped to minor/patch (next, radix-ui packages, lucide-react, @tanstack/react-query, @vitejs/plugin-react, etc.) — plain `bun update` (respects `package.json` semver ranges, no `--latest`); direct bumps: `@hookform/resolvers` 5.2.2→5.9.1, `@tanstack/react-query` 5.97.0→5.104.2, `lucide-react` 1.55.0→1.57.0, `react-hook-form` 7.72.1→7.90.0, `zod` 4.3.6→4.6.7, `zustand` 5.0.12→5.0.15, `@testing-library/user-event` 14.6.7→14.6.8, `@types/react`/`@types/react-dom` →19.3.0, `eslint` →9.39.5, `tailwindcss`/`@tailwindcss/postcss` →4.3.3, `typescript` →5.9.3; `next`/`react`/`react-dom`/`eslint-config-next` pinned, `radix-ui`/`@vitejs/plugin-react` already latest
  - [x] Review the diff and keep only minor/patch moves (revert any unintended majors) — all moves stay within the same major; no unintended majors, nothing to revert
  - [x] Verify: `bun run lint` exit 0 (3 pre-existing `no-console` warnings), `bunx tsc --noEmit` 0 errors, `bun run test` passes (3/3), `bun run build` success (8/8 static pages prerendered)

- [x] **P2.2 Pin Dockerfile runner image to a specific node:22-alpine patch**
  - [x] Replace `node:22-alpine` in the `runner` stage with a specific patch tag (e.g. `node:22.x.y-alpine`) — pinned `runner` to `node:22.23.3-alpine` (latest Node 22 patch per `nodejs.org/dist/index.json`; tag confirmed present on Docker Hub: `22.23.3-alpine`)
  - [x] Verify: Dockerfile syntax check — single-line `FROM` change only (line 27), all three stages well-formed (`oven/bun:1`, `oven/bun:1`, `node:22.23.3-alpine`), no other edits
  - [x] `docker build -t my-nextjs-template .` exit 0; container smoke-tests return 200 — parent-verified docker build exit 0 (image sha256:68f65b6a96fc38e937c72deb823e39abfbff8c61aa001d323dfaa80b7eeddb18)

- [x] **P2.3 Add security audit step to CI**
  - [x] Add a dependency security audit step (e.g. `bun audit` / `bun pm audit` or an equivalent scanner) to `.github/workflows/ci.yml` — audit step `bun audit` added non-blocking (`continue-on-error: true`) before Lint
  - [x] Decide failure vs. warning policy for findings and document it in the step — warning policy documented in workflow comment
  - [x] Verify: workflow YAML lints clean; audit step runs and reports as expected — YAML validated
<!-- END:upgrade-priorities -->

<!-- BEGIN:example-pages -->
## Example pages implementation

Bounded, ordered checklist for adding example pages (table, dashboard, profile-form, upload) plus i18n. Bun only (never npm). Feature-based folder structure, barrel exports, semantic tokens, `queryKeys` factory. Do not start any phase until its dependencies are complete. All items start pending — mark only after verifying.

- [x] **Fase 1 Fondasi**
  - [x] Install `sonner`, `date-fns`, `@tanstack/react-table`, `recharts`, `react-dropzone` via Bun (`bun add`) (next-intl skipped to Fase 6)
  - [x] Add Sonner `<Toaster />` in `src/providers/` (mounted once at app root)
  - [x] Add `Skeleton` component to `src/components/ui/` (shadcn primitives, semantic tokens, barrel export)
  - [x] Refactor `useAppStore` to a Zustand SSR-safe pattern (store factory + context provider) and use it for real
  - [x] Add `AppHeader` nav group "Examples" with links to `/examples/table`, `/examples/dashboard`, `/examples/profile-form`, `/examples/upload`
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success

- [x] **Fase 2 `/examples/table`**
  - [x] TanStack Table + React Query with server-side pagination + sorting
  - [x] Mock service in `src/features/examples/services` with simulated delay
  - [x] `Skeleton` loading state while fetching
  - [x] Format date column with `date-fns`
  - [x] Use `queryKeys.examples.table` from the query-keys factory
  - [x] Barrel exports; semantic tokens; no hardcoded colors
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success

- [x] **Fase 3 `/examples/dashboard`**
  - [x] Recharts line + bar charts fed by mock data via React Query — `fetchExampleDashboard` (30 seeded daily points + summary) in `example-dashboard-service.ts`, `useExampleDashboard` hook using `queryKeys.examples.dashboard()`; `LineChart` (revenue) + `BarChart` (orders) in `example-dashboard-view.tsx`
  - [x] `Skeleton` loading state while fetching — summary cards + both chart cards render skeleton placeholders on `isLoading`
  - [x] Format axis labels with `date-fns` — `format(new Date(value), 'MMM d')` for X axis ticks, `'PPPP'` in the custom tooltip
  - [x] Barrel exports; semantic tokens — updated `components`/`hooks`/`services` barrels + `queryKeys.examples.dashboard`; chart colors use `var(--chart-1)`/`var(--chart-2)`, grid `var(--border)`, ticks `var(--muted-foreground)`, tooltip on `popover`/`border` tokens (no hardcoded hex)
  - [x] Verify: `bun run lint` exit 0 (3 pre-existing `no-console` warnings), `bunx tsc --noEmit` 0 errors, `bun run test` passes (3/3), `bun run build` success (`/examples/dashboard` prerendered)

- [x] **Fase 4 `/examples/profile-form`**
  - [x] RHF + Zod + `useFieldArray` for a dynamic email list — `profileFormSchema` (`fullName`/`headline`/optional `bio` + `emails[]` of `{label,address}` with `min(1)`) in `features/examples/types`; `ExampleProfileFormView` wires `useForm` + `zodResolver` + `useFieldArray({ control, name: 'emails' })` with add/remove (remove disabled at one row)
  - [x] Submit via React Query mutation — `useExampleProfileForm` (`useMutation`, `mutationKey: queryKeys.examples.profileForm()`) calling `submitExampleProfile` service (700ms delay, `fail` in full name triggers the error path)
  - [x] Sonner toast on success/failure — `toast.success`/`toast.error` in the mutation's `onSuccess`/`onError` (app-root `ToasterProvider`)
  - [x] Barrel exports; semantic tokens — updated `types`/`services`/`hooks`/`components` barrels; shadcn `Card`/`Input`/`Label`/`Button` + `text-destructive`/`text-muted-foreground`/`bg-muted/30`/`border-border` tokens, no hardcoded colors
  - [x] Verify: `bun run lint` exit 0 (same 3 pre-existing `no-console` warnings), `bunx tsc --noEmit` 0 errors, `bun run test` passes (3/3), `bun run build` success (`/examples/profile-form` prerendered)

- [x] **Fase 5 `/examples/upload`**
  - [x] `react-dropzone` drag & drop with file list preview — `useDropzone` (10MB `maxSize`) in `example-upload-view.tsx` with drag-active styling, per-file icon/size preview, and remove action
  - [x] Mock upload with progress indicator — `useMutation` (`mutationKey: queryKeys.examples.upload()`) simulates 20→100% progress via `setTimeout`, rendered with shadcn `Progress` + percentage label; ~10% simulated failure exercises the error path
  - [x] Sonner toast on completion/failure — `toast.success` / `toast.error` in mutation `onSuccess` / `onError` (app-root `ToasterProvider`)
  - [x] Barrel exports; semantic tokens — `ExampleUploadView` exported from `components/index.ts`; uses `Card`/`Button`/`Progress` + `border-border`/`bg-muted`/`text-foreground`/`text-muted-foreground`/`text-destructive`/`bg-primary` tokens (file-type icons keep intentional accent colors)
  - [x] Verify (quick, no build): `bun run lint` exit 0 (3 pre-existing `no-console` warnings), `bunx tsc --noEmit` 0 errors; route `src/app/(main)/examples/upload/page.tsx` renders `ExampleUploadView`

- [x] **Fase 6 i18n (`next-intl`, locale via cookie, no URL prefix)**
  - [x] Add `next-intl` provider (cookie-based locale, no locale-prefix routing)
  - [x] Use `useTranslations` in components
  - [x] Add locale switcher ID/EN in `AppHeader`
  - [x] Translate navbar and the profile-form page
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success

- [x] **Fase 7 Verifikasi final**
  - [x] Polish: replace hardcoded file-type icon accents (`text-blue-500`/`text-emerald-500`/`text-amber-500`) in `example-upload-view.tsx` `getFileIcon` with semantic tokens (`text-primary`, `text-primary/70`, `text-muted-foreground`)
  - [x] `bun run lint` exit 0 (0 errors, 5 warnings — 3 pre-existing `no-console`, 2 `import/no-anonymous-default-export` from Fase 6)
  - [x] `bunx tsc --noEmit` 0 errors
  - [x] `bun run test` passes (3/3)
  - [x] `bun run build` success — all 4 `/examples/*` routes built (`/examples/dashboard`, `/examples/profile-form`, `/examples/table`, `/examples/upload`)
  - [x] `docker build -t my-nextjs-template .` exit 0 — parent-verified (image sha256:397183ce...849c65)
  - [x] Smoke test `/`, `/login`, `/examples/table`, `/examples/dashboard`, `/examples/profile-form`, `/examples/upload` return 200 on `PORT=3100` — parent-verified
<!-- END:example-pages -->

<!-- BEGIN:dashboard-design-system -->
## Dashboard design system

Bounded, ordered checklist for unifying 3 reference designs (CONYEST finance dashboard, ECOM product form, MONETRA fintech dashboard) into ONE design system. Bun only (never npm). Feature-based structure (`features/finance/`, `features/products/`), barrel exports, `queryKeys` factory, semantic oklch tokens only (no hex, no `zinc-*`, no manual `dark:` overrides). Do not start any phase until its dependencies are complete. All items start pending — mark only after verifying. Full brief at `/tmp/dashboard-brief.md`.

Unified decisions: primary = forest green (buttons), accent lime token (badges/active bars/CTAs), chart-1 lime / chart-2 forest, `--surface-inverse` for dark cards (balance + bank card); form tabs freely navigable (not a sequential stepper).

- [x] **Phase 1 Tokens & primitives**
  - [x] Add tokens (`--lime`/accent, `--surface-inverse`, chart palette) in `src/app/globals.css` (`:root` + `.dark`, oklch, `@theme inline` mappings)
  - [x] `bunx --bun shadcn@latest add -y avatar badge table tabs breadcrumb popover command select calendar checkbox tooltip separator progress sheet` (skip ones already present: progress exists)
  - [x] Create reusable components under `src/components/ui/`: `chip-token.tsx` (removable badge w/ color dot), `search-multi-select.tsx` (Command+Popover, async-filterable options), `input-with-unit.tsx` (Input + trailing small Select), `stat-card.tsx`, `balance-card.tsx` (dark inverse surface), `segmented-tabs.tsx`
  - [x] Update `src/components/ui/index.ts` barrel
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success

- [x] **Phase 2 Dashboard shell**
  - [x] `AppSidebar` icon rail variant (icon-only w/ Tooltip hover labels, avatar on top, settings/help/logout at bottom, Sheet for mobile)
  - [x] Header with pill nav + search input + bell + avatar dropdown
  - [x] Route group `src/app/(dashboard)/dashboard/layout.tsx`
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success

- [x] **Phase 3 Finance dashboard (Monetra layout)**
  - [x] Greeting header, `SmartWalletCard` (+Add New badge, 3 category icon tiles)
  - [x] 4 `StatCard`s, `QuickSend` avatar stack, `BankCard` (masked number, Deposit/Transfer), `QuickAction` grid, `StarterPlan` CTA
  - [x] Mock service + React Query hooks + `queryKeys.finance.*` entries, `Skeleton` while loading
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success

- [x] **Phase 4 Cash Flow chart**
  - [x] Recharts `BarChart` monthly, custom black rounded Tooltip, segmented tabs (Income/Expenses/Savings), period Select (Yearly/Monthly), active bar lime
  - [x] Colors via `var(--chart-1)`/`var(--chart-2)`/`var(--border)`/`var(--muted-foreground)`
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success

- [x] **Phase 5 CONYEST analytics screen**
  - [x] Route `/analytics` reusing CashflowChart + StatCard + BalanceCard + donut PieChart with legend
  - [x] Recent Transactions TanStack Table with status Badges (default=Completed, destructive=Failed, secondary+amber text=Pending), This Month filter
  - [x] Mock service + `queryKeys.finance.transactions`
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run build` success

- [x] **Phase 6 Product form `/products/new` (ecom)**
  - [x] Breadcrumb, 6 Tabs (only "Variations and price" implemented; others render placeholder)
  - [x] `SearchMultiSelect` for Colour/Size (mock async service), `ChipToken` selection
  - [x] Variant matrix grid = cartesian product of colours x sizes with sparse overrides (RHF + zodResolver + useFieldArray; per-row stock/price/discount inline Inputs; Price/Discount merged column per colour group; removing a chip removes related rows)
  - [x] Grouped "Price & offer" sub-panel (Price + currency Select, Promo price + type Select, date range via Calendar+Popover)
  - [x] Zod schema in `features/products/types`, unit test (vitest) for matrix builder logic
  - [x] Verify: `bun run lint` exit 0, `bunx tsc --noEmit` 0 errors, `bun run test` passes, `bun run build` success

- [x] **Phase 7 Final verification**
  - [x] `bun run lint`, `bunx tsc --noEmit`, `bun run test`, `bun run build` all pass
  - [x] Smoke test routes `/dashboard`, `/analytics`, `/products/new` return 200 (parent runs server on `PORT=3100` — do NOT start servers, do NOT touch `/proc`, no process discovery)
<!-- END:dashboard-design-system -->

<!-- BEGIN:ss-blocks-wiring -->
## SS Blocks wiring checklist

- [x] **1. Auth routes (`/verify-email`, `/2fa`)** — installed and wired (`verify-email-01`, `two-factor-authentication-01`); existing login/register/forgot/reset kept with existing auth logic (collision handled)
- [x] **2. Dashboard Demo (`/dashboard-v2`)** — shell, sidebar, header, footer, and Sales Metrics chart (`chart-component-01`)
- [x] **3. Marketing Route Group `(marketing)`** — layout with footer (`footer-component-11`), landing `/` (hero-01 + HomeHero + logo-cloud-01 + testimonials-26 + faq-21), `/about` (about-us-page-01 + timeline-05/07 + hero-41 + logo-cloud-10), `/contact`, `/blog` (blog-15 + blog-17), `/portfolio`, `/events`, `/team`, `/faq`, `/gallery`, `/schedule`, `/account-settings`, `/email-application`, `/form-layout`, `/file-upload`
- [x] **4. Cleanup & Quality** — raw block orphan folders removed; helper scripts removed; `src/lib/utils.ts` fixed to re-export `cn` from `@/utils`
<!-- END:ss-blocks-wiring -->

<!-- BEGIN:global-sidebar-shell -->
## Global sidebar shell checklist

- [x] **1. Shared sidebar shell component (`SsAppShell`)** — created in `src/components/layouts/ss-app-shell.tsx` combining `SidebarProvider`, collapsible `Sidebar`, header with trigger + search + notifications + language + theme + user menu, and footer.
- [x] **2. Navigation covering ALL routes** — grouped into Overview (`/`, `/dashboard`, `/dashboard-v2`, `/analytics`), Apps (`/products/new`, `/email-application`, `/schedule`, `/file-upload`, `/form-layout`, `/account-settings`, `/events`), and Marketing (`/about`, `/blog`, `/contact`, `/portfolio`, `/team`, `/faq`, `/gallery`) with active states and badges.
- [x] **3. Applied to all layouts except auth** — wired into `(marketing)/layout.tsx`, `(main)/layout.tsx`, `(dashboard)/layout.tsx`, and `dashboard-v2/layout.tsx`. Auth pages (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/2fa`) excluded.
- [x] **4. Refactored finance dashboard (`/dashboard`)** — wrapped via `(dashboard)/layout.tsx` using `SsAppShell`.
- [x] **5. Final verification** — `bun run lint`, `bunx tsc --noEmit`, `bun run test`, `bun run build` all pass successfully. Theme toggle hydration mismatch robustly fixed via CSS-only visibility toggle (`dark:hidden` / `dark:block`) with no mounted/disabled gating.
<!-- END:global-sidebar-shell -->

<!-- BEGIN:mui-density-restyle -->
## MUI-density restyle checklist

- [x] **F0. Foundation tokens** — elevation shadow vars (`--shadow-elevation-1`, `--shadow-elevation-4`, `--shadow-elevation-8`, `--shadow-elevation-24`) added to `src/app/globals.css` `@theme inline` (original `--radius-control` (4px) token removed in the adjustment below).
- [x] **F1. Buttons & toggles** — `button.tsx`, `toggle.tsx`, `toggle-group.tsx`, `segmented-tabs.tsx` restyled with elevation-1 default shadow with hover elevation-4, segmented tabs 1px border group with filled muted selected state.
- [x] **F2. Inputs family** — `input.tsx`, `select.tsx`, `textarea.tsx`, `input-group.tsx`, `password-input.tsx`, `input-otp.tsx`, `input-with-unit.tsx`, `search-multi-select.tsx` restyled with text-base, `font-medium`, primary border + 1px ring focus state.
- [x] **F3. Selection controls** — checkbox 18px square 40px hit area, radio-group 20px circle with primary dot, switch MUI geometry (58x38 touch area, 34x14 track, 24px thumb), calendar selected day filled circle primary.
- [x] **F4. Overlays & menus** — dialog elevation-24 + xl font-medium title; dropdown-menu elevation-8 items; popover & sheet elevation-8; tooltip solid dark bg + xs text.
- [x] **F5. Data display** — card with elevation-1 + xl font-medium title; table spacious row padding + medium head; badge & chip-token pill; progress 4px track; pagination rounded-full primary active; breadcrumb '›' separator; navigation-menu font-medium; accordion/collapsible divider borders + py-4 font-medium trigger.
- [x] **Adjustment (user feedback: heights too tall, radius too sharp)** — radii reverted to default shadcn tokens (`rounded-lg` controls/inputs/buttons/overlays, `rounded-md` dropdown item & checkbox, `rounded-xl` card, `rounded-full` kept for badge/chip-token/pagination/switch/radio/progress); removed unused `--radius-control` token from `globals.css`; heights stepped down: button h-10→h-9 (lg h-12→h-10), inputs family h-12→h-10 (sm h-9), otp slots size-12→size-10, textarea min-h-24→min-h-20, dropdown item h-10→h-9, toggle h-10→h-9 (lg h-12→h-10), navigation-menu h-10→h-9, segmented-tabs h-10→h-9, pagination size-10→size-9; kept `font-medium`/`text-base` on inputs and all elevation shadows. Verified: lint 0/0, tsc 0 errors, build success.
<!-- BEGIN:select-combobox-upgrade -->
## Select & Combobox upgrade checklist (Fase A-C)

- [x] **Fase A. Select (`select.tsx`)** — trigger w-full default with open-state styling (`data-[state=open]:border-primary data-[state=open]:ring-1`) and rotating chevron icon (`group-data-[state=open]/select-trigger:rotate-180`); item h-9 with `data-[state=checked]:bg-primary/10` and `font-medium`; optional `clearable` prop support with inline clear button when value non-empty.
- [x] **Fase B. Multi-Select & Command (`search-multi-select.tsx`, `command.tsx`)** — Command input updated to h-10 with standard input border/bg; selected values rendered as removable `ChipToken` pills inside `SearchMultiSelect`; filterable popover includes "Select all" and "Clear all" footer action buttons; empty state styled with `SearchX` icon; Command item selected state enhanced with `bg-accent` / check indicator styles.
- [x] **Fase C. Verification & Call Sites** — all call sites verified and working; `bun run lint` (0/0), `bunx tsc --noEmit`, `bun run test` (6/6), and `bun run build` (31 routes) all pass successfully.
<!-- END:select-combobox-upgrade -->
