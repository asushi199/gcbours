import { describe, expect, it } from "vitest";
import {
  DEFAULT_CHAPTER_LABELS,
  isChapterId,
  resolveChapterLabels,
} from "@/config/chapters";

describe("chapters config", () => {
  it("validates chapter ids", () => {
    expect(isChapterId("growing_together")).toBe(true);
    expect(isChapterId("nope")).toBe(false);
  });

  it("merges custom labels", () => {
    const labels = resolveChapterLabels({
      growing_together: "慢慢变好的我们",
      beginning: "  ",
    });
    expect(labels.growing_together).toBe("慢慢变好的我们");
    expect(labels.beginning).toBe(DEFAULT_CHAPTER_LABELS.beginning);
  });
});
