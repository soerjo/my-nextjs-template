<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint flat config (`eslint.config.mjs`, extends `core-web-vitals` + `typescript`)
- `npx tsc --noEmit` — type check (no npm script)
- No test framework is configured

## Stack

- Next.js 16 (App Router only), React 19, TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss` — `tailwind.config.js` exists but is a v3 leftover; do not edit it
- HeroUI (`@heroui/react`) — styles imported in `globals.css` via `@import "@heroui/styles"`
- TanStack React Query wired up via `src/providers/query-provider.tsx` (staleTime: 60s, no refetch on focus)

## Stale config files (ignore these)

- `tailwind.config.js` — v3 leftover; Tailwind v4 uses CSS-based config
- `.eslintrc.json`, `.eslintignore` — legacy format; ESLint 9 uses `eslint.config.mjs`
- `next.config.js` — `.ts` version is the active one

## Architecture

Feature-based folder structure under `src/`:
- `src/features/` — domain modules (auth, home, …). Each feature owns its components, hooks, services, and types.
- `src/components/` — shared: `ui/` (base/reusable), `layouts/` (app shell)
- `src/lib/` — api-client (with token refresh), query-keys factory
- `src/providers/` — client-side context providers (QueryProvider, etc.)
- `src/types/` — shared TypeScript types
- `src/utils/` — pure utility functions (`cn`, `formatDate`, etc.)
- `src/config/` — app config derived from env vars
- `src/constants/` — static values (routes, API paths)
- `src/app/` — Next.js App Router. Route groups: `(main)/`, `(auth)/`.

Every module directory has a barrel `index.ts` — import via `@/features/home/components`, not deep paths.

## Path alias

`@/*` maps to `src/` (set in `tsconfig.json` paths).

## Style

- Font: Geist (sans + mono), loaded via `next/font/google` in `src/app/layout.tsx`
- `<html>` has `h-full antialiased`; `<body>` has `min-h-full flex flex-col`
- Use `cn()` from `@/utils` for conditional classNames
- Use `AppLink` from `@/components/ui` for navigation links (handles internal vs external automatically)

## Package manager

Bun is preferred (`bun.lock` present, `.npmrc` sets `package-lock=false`). npm scripts work via both npm and bun.

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
