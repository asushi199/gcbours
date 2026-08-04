import { describe, expect, it } from "vitest";
import { PublishMemorySchema, normalizePublishSlug } from "@/features/memories/publish-memory";

describe("publish-memory helpers", () => {
  it("normalizes slug candidates", () => {
    expect(normalizePublishSlug("Evening Walk!!")).toBe("evening-walk");
  });

  it("validates publish payload", () => {
    expect(PublishMemorySchema.safeParse({ slug: "ok-slug" }).success).toBe(true);
    expect(PublishMemorySchema.safeParse({ slug: "Bad Slug" }).success).toBe(false);
    expect(PublishMemorySchema.safeParse({ slug: "ab" }).success).toBe(false);
  });
});
