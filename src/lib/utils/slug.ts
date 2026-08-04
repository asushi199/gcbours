export function slugifyTitle(input: string) {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return base || "memory";
}

export function buildDraftSlug(eventDate: string, titleHint?: string) {
  const datePart = eventDate.replaceAll("-", "");
  const titlePart = slugifyTitle(titleHint ?? "untitled");
  const suffix = crypto.randomUUID().slice(0, 8);
  return `${datePart}-${titlePart}-${suffix}`;
}
