import { describe, expect, it } from "vitest";
import { designTokens } from "@/config/design-tokens";
import { UnlockPayloadSchema } from "@/lib/security/unlock-schema";

describe("design tokens", () => {
  it("exposes the OURS background color", () => {
    expect(designTokens.background).toBe("#F6F1EA");
  });
});

describe("UnlockPayloadSchema", () => {
  it("accepts a non-empty code", () => {
    const result = UnlockPayloadSchema.safeParse({ code: "0520" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty code", () => {
    const result = UnlockPayloadSchema.safeParse({ code: "" });
    expect(result.success).toBe(false);
  });
});
