export type GroupablePhoto = {
  id: string;
  takenAt: Date | null;
  latitude: number | null;
  longitude: number | null;
};

export type PhotoGroupCandidate = {
  photoIds: string[];
  eventDate: string;
  startAt: string | null;
  endAt: string | null;
  latitude: number | null;
  longitude: number | null;
  confidence: number;
};

const MS_HOUR = 60 * 60 * 1000;

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

function sameCalendarDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Deterministic Phase 3 grouping rules from PROJECT_SPEC §12.
 */
export function groupPhotos(photos: GroupablePhoto[]): PhotoGroupCandidate[] {
  const sorted = [...photos].sort((a, b) => {
    const at = a.takenAt?.getTime() ?? Number.POSITIVE_INFINITY;
    const bt = b.takenAt?.getTime() ?? Number.POSITIVE_INFINITY;
    if (at !== bt) return at - bt;
    return a.id.localeCompare(b.id);
  });

  const groups: GroupablePhoto[][] = [];

  for (const photo of sorted) {
    const current = groups[groups.length - 1];
    if (!current) {
      groups.push([photo]);
      continue;
    }

    const prev = current[current.length - 1];
    const shouldJoin = canJoin(prev, photo);
    if (shouldJoin.join) {
      current.push(photo);
    } else {
      groups.push([photo]);
    }
  }

  return groups.map((group) => {
    const withTime = group.filter((item) => item.takenAt);
    const start = withTime[0]?.takenAt ?? null;
    const end = withTime[withTime.length - 1]?.takenAt ?? null;
    const withGps = group.find(
      (item) => item.latitude != null && item.longitude != null,
    );

    let confidence = 0.55;
    if (withTime.length === group.length) confidence += 0.2;
    if (withGps) confidence += 0.1;
    if (group.length > 1) confidence += 0.05;

    return {
      photoIds: group.map((item) => item.id),
      eventDate: start ? toDateKey(start) : new Date().toISOString().slice(0, 10),
      startAt: start?.toISOString() ?? null,
      endAt: end?.toISOString() ?? null,
      latitude: withGps?.latitude ?? null,
      longitude: withGps?.longitude ?? null,
      confidence: Math.min(1, confidence),
    };
  });
}

function canJoin(prev: GroupablePhoto, next: GroupablePhoto) {
  if (!prev.takenAt || !next.takenAt) {
    return { join: false, reason: "missing_time" as const };
  }

  const delta = Math.abs(next.takenAt.getTime() - prev.takenAt.getTime());
  const sameDay = sameCalendarDay(prev.takenAt, next.takenAt);

  let join = false;
  if (sameDay && delta <= 12 * MS_HOUR) {
    join = true;
  } else if (!sameDay && delta < 4 * MS_HOUR) {
    join = true;
  } else if (delta <= 4 * MS_HOUR) {
    join = true;
  }

  if (!join && delta > 4 * MS_HOUR) {
    return { join: false, reason: "gap" as const };
  }

  if (
    join &&
    prev.latitude != null &&
    prev.longitude != null &&
    next.latitude != null &&
    next.longitude != null
  ) {
    const distance = haversineKm(
      prev.latitude,
      prev.longitude,
      next.latitude,
      next.longitude,
    );
    if (distance > 5 && delta > 2 * MS_HOUR) {
      return { join: false, reason: "far_gps" as const };
    }
  }

  return { join, reason: join ? ("ok" as const) : ("gap" as const) };
}

export function mergeGroups(
  groups: PhotoGroupCandidate[],
  leftIndex: number,
  rightIndex: number,
): PhotoGroupCandidate[] {
  if (
    leftIndex < 0 ||
    rightIndex < 0 ||
    leftIndex >= groups.length ||
    rightIndex >= groups.length ||
    leftIndex === rightIndex
  ) {
    return groups;
  }

  const [a, b] = [leftIndex, rightIndex].sort((x, y) => x - y);
  const merged: PhotoGroupCandidate = {
    photoIds: [...groups[a].photoIds, ...groups[b].photoIds],
    eventDate: groups[a].eventDate,
    startAt: groups[a].startAt,
    endAt: groups[b].endAt ?? groups[a].endAt,
    latitude: groups[a].latitude ?? groups[b].latitude,
    longitude: groups[a].longitude ?? groups[b].longitude,
    confidence: Math.max(groups[a].confidence, groups[b].confidence),
  };

  return groups.filter((_, index) => index !== a && index !== b).toSpliced(a, 0, merged);
}

export function splitGroup(
  group: PhotoGroupCandidate,
  atPhotoIndex: number,
): PhotoGroupCandidate[] {
  if (atPhotoIndex <= 0 || atPhotoIndex >= group.photoIds.length) {
    return [group];
  }

  const leftIds = group.photoIds.slice(0, atPhotoIndex);
  const rightIds = group.photoIds.slice(atPhotoIndex);

  return [
    { ...group, photoIds: leftIds },
    { ...group, photoIds: rightIds, confidence: group.confidence * 0.9 },
  ];
}
