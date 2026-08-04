import { describe, expect, it } from "vitest";
import { buildDraftSlug, buildPublishSlug, slugifyTitle } from "@/lib/utils/slug";

describe("slug helpers", () => {
  it("slugifies to ASCII-only segments", () => {
    expect(slugifyTitle("江边的晚风")).toBe("memory");
    expect(slugifyTitle("Hello World!")).toBe("hello-world");
    expect(slugifyTitle("20260804-草稿-2026-08-04-f0745959")).toBe(
      "20260804-2026-08-04-f0745959",
    );
  });

  it("builds unique draft slugs", () => {
    const a = buildDraftSlug("2025-05-20", "evening");
    const b = buildDraftSlug("2025-05-20", "evening");
    expect(a).toMatch(/^20250520-evening-/);
    expect(a).not.toBe(b);
  });

  it("builds publish slugs without Chinese", () => {
    expect(buildPublishSlug("2026-08-04", "福州之行：从紧张到闪耀")).toMatch(
      /^20260804-memory-[a-f0-9]{4}$/,
    );
    expect(buildPublishSlug("2026-08-04", "Fuzhou Trip")).toBe("20260804-fuzhou-trip");
  });
});
