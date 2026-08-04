/** URL-safe slug piece: ASCII letters/digits only (Chinese titles fall back to "memory"). */
export function slugifyTitle(input: string) {
  const base = input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 48);

  return base || "memory";
}

export function buildDraftSlug(eventDate: string, titleHint?: string) {
  const datePart = eventDate.replaceAll("-", "");
  const titlePart = slugifyTitle(titleHint ?? "untitled");
  const suffix = crypto.randomUUID().slice(0, 8);
  return `${datePart}-${titlePart}-${suffix}`;
}

/** Default slug shown in the publish confirm panel. */
export function buildPublishSlug(eventDate: string, titleHint?: string) {
  const datePart = eventDate.replaceAll("-", "");
  const titlePart = slugifyTitle(titleHint ?? "memory");
  // Pure-Chinese titles become "memory"; add a short suffix so repeats don't collide.
  if (titlePart === "memory") {
    const suffix = crypto.randomUUID().slice(0, 4);
    return `${datePart}-memory-${suffix}`;
  }
  return `${datePart}-${titlePart}`.replace(/-{2,}/g, "-").slice(0, 80);
}
