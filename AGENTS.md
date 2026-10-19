<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — my-nextjs-template

Template frontend Next.js 16 (App Router) + React 19 + shadcn/ui, package manager **bun**.
Repositori UI (`ums-ui`, `wms-ui`, `pos-ui`, `my-cms-ui`, `minio-file-ui`) diturunkan dari sini.

## Commands

- `bun run dev` — dev server
- `bun run build` — production build
- `bun run lint` — ESLint flat config
- `bunx tsc --noEmit` — typecheck
- `bun run test` — **vitest** (`vitest.config.ts`, spec di `src/__tests__/`)
- `bun run test:coverage`

Gate wajib sebelum PR: `bunx tsc --noEmit` + `bun run lint` + `bun run build` + `bun run test`.

## Stack

- Next.js 16 (App Router saja), React 19, TypeScript
- Tailwind CSS v4 lewat `@tailwindcss/postcss` — CSS-first di `src/app/globals.css` (`@theme`)
- **shadcn/ui (Radix)** — primitives di `src/components/ui`. Jangan campur HeroUI/MUI/Chakra/Ant
  (migrasi HeroUI → shadcn sudah pernah dilakukan di repositori turunannya; jangan diulang).
- TanStack React Query, TanStack Table, React Hook Form + Zod, Zustand, next-intl, next-themes, sonner

## Peta folder

```
src/
  app/
    (auth)/            login · register · forgot-password · reset-password · verify-email · 2fa
    (dashboard)/       dashboard · analytics · products/new · account-settings · dashboard-v2
    (marketing)/       about · blog · contact · faq · team · events · portfolio · dst. + examples/
  proxy.ts             route protection berbasis cookie refresh token
  features/            domain modules: components/ hooks/ services/ types/ + barrel index.ts
  components/          ui/ (shadcn) · layouts/ (app shell)
  lib/                 api-client (auto auth header + token refresh), query-keys
  providers/ stores/ hooks/ utils/ constants/ types/ i18n/ config/
  __tests__/           vitest
```

Impor lewat barrel (`@/features/home`), bukan path dalam. Alias `@/*` → `src/`.

## Aturan keras

- **bun saja.** `bun run <script>`, `bunx <binary>`.
- **shadcn/ui satu-satunya UI library.** Tailwind hanya untuk layout utility; styling komponen lewat
  token shadcn di `globals.css`.
- Blok `<!-- BEGIN:nextjs-agent-rules -->` di atas ditulis ulang otomatis oleh `next dev`.
  **Jangan dihapus.**
- Backend dipanggil lewat **route proxy**, bukan langsung dari browser. `NEXT_PUBLIC_API_URL`
  di-bake saat build; biarkan kosong agar fallback ke `/api`.
- Response API dibungkus amplop `{ statusCode, message, data, timestamp, path }` — service layer
  melakukan `unwrap`; komponen menerima data domain.
- Tipe response API digenerate dari kontrak OpenAPI service pasangannya (`openapi-typescript`),
  bukan ditulis tangan.
- **Server state** → TanStack Query; **client state** → Zustand. Jangan mencampur.
- Delivery lewat PR; tidak ada push langsung ke `main`.
- Checklist pekerjaan tinggal di GitHub Issues, **bukan** di file ini.

## Env

- `NEXT_PUBLIC_APP_NAME` · `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL` — **kosongkan** agar memakai `/api`
- `API_PROXY_TARGET` — URL backend internal untuk route proxy
- `NEXT_PUBLIC_DUMMY_MODE` — `true`/`1` memalsukan request auth untuk development tanpa backend

## Auth

- Proteksi route terpusat di `src/proxy.ts` berdasarkan cookie refresh token.
- Arsitektur auth sisi klien: `docs/03-auth-client.md`.
- Model token dan JWKS adalah milik backend (UMS) — lihat `docs/platform/PLATFORM.md` di repo
  turunan, atau repo `soerjo/platform-docs`.

## Utang teknis yang diketahui

- Cakupan test minimal (satu smoke test).
- Halaman `(auth)` turunannya tergantung backend yang menyediakan flow-nya.

## Alur SDD

Template ini sudah dilengkapi **Spec Kit** (integrasi agent `omp`).
`/speckit.constitution` sekali per repo baru, lalu per fitur:
`/speckit.specify` → `/speckit.clarify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`
→ `/speckit.converge`. Konstitusi platform yang diwarisi: repo `soerjo/platform-docs`.
