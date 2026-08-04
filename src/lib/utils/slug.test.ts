import { describe, expect, it } from "vitest";
import { buildDraftSlug, slugifyTitle } from "@/lib/utils/slug";

describe("slug helpers", () => {
  it("slugifies mixed titles", () => {
    expect(slugifyTitle("江边的晚风")).toContain("江边");
    expect(slugifyTitle("Hello World!")).toBe("hello-world");
  });

  it("builds unique draft slugs", () => {
    const a = buildDraftSlug("2025-05-20", "evening");
    const b = buildDraftSlug("2025-05-20", "evening");
    expect(a).toMatch(/^20250520-evening-/);
    expect(a).not.toBe(b);
  });
});
