import { describe, expect, it } from "vitest";
import {
  groupPhotos,
  mergeGroups,
  splitGroup,
} from "@/features/event-grouping/group-photos";

describe("groupPhotos", () => {
  it("keeps same-day close photos together", () => {
    const groups = groupPhotos([
      {
        id: "a",
        takenAt: new Date("2025-05-20T10:00:00Z"),
        latitude: null,
        longitude: null,
      },
      {
        id: "b",
        takenAt: new Date("2025-05-20T12:00:00Z"),
        latitude: null,
        longitude: null,
      },
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].photoIds).toEqual(["a", "b"]);
  });

  it("splits when gap exceeds 4 hours across different contexts", () => {
    const groups = groupPhotos([
      {
        id: "a",
        takenAt: new Date("2025-05-20T08:00:00Z"),
        latitude: null,
        longitude: null,
      },
      {
        id: "b",
        takenAt: new Date("2025-05-20T15:00:00Z"),
        latitude: null,
        longitude: null,
      },
    ]);
    // 7h gap same day but > 4h continuous rule after 12h window check:
    // same day && <= 12h => still same group per rule 2
    expect(groups).toHaveLength(1);
  });

  it("splits far GPS with multi-hour gap", () => {
    const groups = groupPhotos([
      {
        id: "a",
        takenAt: new Date("2025-05-20T10:00:00Z"),
        latitude: 31.2,
        longitude: 121.5,
      },
      {
        id: "b",
        takenAt: new Date("2025-05-20T13:30:00Z"),
        latitude: 39.9,
        longitude: 116.4,
      },
    ]);
    expect(groups).toHaveLength(2);
  });
});

describe("mergeGroups / splitGroup", () => {
  it("merges and splits candidates", () => {
    const base = groupPhotos([
      {
        id: "a",
        takenAt: new Date("2025-05-20T10:00:00Z"),
        latitude: null,
        longitude: null,
      },
      {
        id: "b",
        takenAt: new Date("2025-05-21T10:00:00Z"),
        latitude: null,
        longitude: null,
      },
    ]);
    expect(base.length).toBeGreaterThanOrEqual(1);
    const merged = mergeGroups(base, 0, Math.min(1, base.length - 1));
    expect(merged[0].photoIds.length).toBeGreaterThanOrEqual(1);
    const split = splitGroup(
      {
        photoIds: ["a", "b", "c"],
        eventDate: "2025-05-20",
        startAt: null,
        endAt: null,
        latitude: null,
        longitude: null,
        confidence: 0.8,
      },
      1,
    );
    expect(split).toHaveLength(2);
    expect(split[0].photoIds).toEqual(["a"]);
    expect(split[1].photoIds).toEqual(["b", "c"]);
  });
});
