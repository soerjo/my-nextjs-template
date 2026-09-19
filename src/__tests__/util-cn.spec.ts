import { describe, expect, it } from "vitest";
import { cn } from "@/utils";

describe("cn", () => {
  it("returns a plain valid class string as-is", () => {
    expect(cn("foo bar baz")).toBe("foo bar baz");
  });

  it("drops falsy inputs (false, null, undefined)", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
    expect(cn(false)).toBe("");
  });

  it("handles conditional object and array forms", () => {
    expect(cn({ "btn": true, "btn--active": false, "is-open": true })).toBe("btn is-open");
    expect(cn(["a", false, "b", null])).toBe("a b");
    expect(cn("base", ["a", { "b": true }], { "c": false })).toBe("base a b");
  });
});