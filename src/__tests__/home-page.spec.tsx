import { describe, expect, it } from "vitest";
import { render, screen } from "@/test-utils";
import HomePage from "@/app/(main)/page";

describe("HomePage", () => {
  it("renders a heading", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /welcome to my app/i })).toBeTruthy();
  });
});