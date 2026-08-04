import { describe, expect, it } from "vitest";
import { getTemplate, memoryTemplates, scoreTemplate } from "@/features/templates/registry";

describe("memory template registry", () => {
  it("includes the five required Phase 1 templates", () => {
    const ids = memoryTemplates.map((template) => template.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "editorial-hero",
        "split-story",
        "polaroid-stack",
        "three-photo-journal",
        "full-bleed-quote",
      ]),
    );
  });

  it("scores a matching template higher", () => {
    const good = scoreTemplate("three-photo-journal", 3, "warm");
    const poor = scoreTemplate("three-photo-journal", 1, "warm");
    expect(good).toBeGreaterThan(poor);
  });

  it("falls back to editorial-hero for unknown ids", () => {
    expect(getTemplate("missing").id).toBe("editorial-hero");
  });
});
