export const CHAPTER_IDS = [
  "beginning",
  "ordinary_days",
  "journeys",
  "celebrations",
  "food_and_places",
  "growing_together",
  "future",
] as const;

export type ChapterId = (typeof CHAPTER_IDS)[number];

export const DEFAULT_CHAPTER_LABELS: Record<ChapterId, string> = {
  beginning: "我们的开始",
  ordinary_days: "普通日子",
  journeys: "一起出发",
  celebrations: "值得庆祝的时刻",
  food_and_places: "吃过的东西和去过的地方",
  growing_together: "一起慢慢长大",
  future: "写给未来",
};

export function isChapterId(value: string): value is ChapterId {
  return (CHAPTER_IDS as readonly string[]).includes(value);
}

/** Merge custom labels over defaults; unknown keys ignored. */
export function resolveChapterLabels(
  custom?: Partial<Record<ChapterId, string>> | null,
): Record<ChapterId, string> {
  const labels = { ...DEFAULT_CHAPTER_LABELS };
  if (!custom) return labels;
  for (const id of CHAPTER_IDS) {
    const value = custom[id]?.trim();
    if (value) labels[id] = value.slice(0, 40);
  }
  return labels;
}
