import { describe, expect, it } from "vitest";
import { normalizeExifInput } from "@/lib/exif/parse-exif";

describe("normalizeExifInput", () => {
  it("prefers DateTimeOriginal over file mtime", () => {
    const result = normalizeExifInput({
      DateTimeOriginal: new Date("2025-05-20T18:30:00Z"),
      fileLastModified: new Date("2026-01-01T00:00:00Z"),
    });
    expect(result.takenAtSource).toBe("exif");
    expect(result.takenAt?.toISOString()).toBe("2025-05-20T18:30:00.000Z");
  });

  it("falls back to file mtime with low-confidence source", () => {
    const result = normalizeExifInput({
      fileLastModified: new Date("2026-01-01T00:00:00Z"),
    });
    expect(result.takenAtSource).toBe("file_mtime");
  });

  it("returns none when no dates exist", () => {
    const result = normalizeExifInput({});
    expect(result.takenAt).toBeNull();
    expect(result.takenAtSource).toBe("none");
  });
});
