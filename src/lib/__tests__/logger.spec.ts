import { describe, expect, it } from "vitest";
import { addLogSink, logger } from "@/lib/logger";

describe("logger", () => {
  it("dispatches structured entries and supports unsubscribe", () => {
    const entries: Array<{ level: string; message: string; context?: Record<string, unknown> }> = [];
    const unsubscribe = addLogSink((entry) => entries.push(entry));

    logger.info("startup", { component: "app" });
    logger.warn("degraded");
    logger.error("failed", new Error("boom"));

    expect(entries).toHaveLength(3);
    expect(entries[0]).toMatchObject({ level: "info", message: "startup", context: { component: "app" } });
    expect(entries[1]).toMatchObject({ level: "warn", message: "degraded" });
    expect(entries[2]).toMatchObject({ level: "error", message: "failed" });

    unsubscribe();
    logger.info("ignored");
    expect(entries).toHaveLength(3);
  });
});
