import { vi, describe, expect, it } from "vitest"

// useAuth (from @/features/auth/hooks) calls useAuthContext which throws without an
// <AuthProvider> wrapping the tree. AppHeader's use of it is incidental to layout
// rendering, so we stub the feature hook only. The HeroUI Button/Spinner and the rest
// of the real component tree are rendered unmocked.
vi.mock("@/features/auth/hooks", () => ({
  useAuth: () => ({ logout: vi.fn(), isLoading: false }),
}))

import { render, screen } from "@/test-utils"
import { AppHeader } from "@/components/layouts/app-header"

describe("AppHeader", () => {
  it("renders a header landmark with navigation and a link with accessible name", () => {
    render(<AppHeader />)

    expect(screen.getByRole("banner")).toBeTruthy()
    expect(screen.getByRole("navigation")).toBeTruthy()
    expect(screen.getByRole("link", { name: /my app/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /logout/i })).toBeTruthy()
  })
})