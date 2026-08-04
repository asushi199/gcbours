export type ParsedExif = {
  takenAt: Date | null;
  takenAtSource: "exif" | "file_mtime" | "none";
  latitude: number | null;
  longitude: number | null;
  orientation: number | null;
  cameraModel: string | null;
  width: number | null;
  height: number | null;
};

function asDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }
  return null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Pure helper for tests and for normalizing exifr output. */
export function normalizeExifInput(input: {
  DateTimeOriginal?: unknown;
  CreateDate?: unknown;
  GPSLatitude?: unknown;
  GPSLongitude?: unknown;
  Orientation?: unknown;
  Model?: unknown;
  ImageWidth?: unknown;
  ImageHeight?: unknown;
  ExifImageWidth?: unknown;
  ExifImageHeight?: unknown;
  fileLastModified?: Date | null;
}): ParsedExif {
  const exifTaken =
    asDate(input.DateTimeOriginal) ?? asDate(input.CreateDate);

  if (exifTaken) {
    return {
      takenAt: exifTaken,
      takenAtSource: "exif",
      latitude: asNumber(input.GPSLatitude),
      longitude: asNumber(input.GPSLongitude),
      orientation: asNumber(input.Orientation),
      cameraModel: typeof input.Model === "string" ? input.Model : null,
      width: asNumber(input.ExifImageWidth) ?? asNumber(input.ImageWidth),
      height: asNumber(input.ExifImageHeight) ?? asNumber(input.ImageHeight),
    };
  }

  if (input.fileLastModified) {
    return {
      takenAt: input.fileLastModified,
      takenAtSource: "file_mtime",
      latitude: asNumber(input.GPSLatitude),
      longitude: asNumber(input.GPSLongitude),
      orientation: asNumber(input.Orientation),
      cameraModel: typeof input.Model === "string" ? input.Model : null,
      width: asNumber(input.ExifImageWidth) ?? asNumber(input.ImageWidth),
      height: asNumber(input.ExifImageHeight) ?? asNumber(input.ImageHeight),
    };
  }

  return {
    takenAt: null,
    takenAtSource: "none",
    latitude: asNumber(input.GPSLatitude),
    longitude: asNumber(input.GPSLongitude),
    orientation: asNumber(input.Orientation),
    cameraModel: typeof input.Model === "string" ? input.Model : null,
    width: asNumber(input.ExifImageWidth) ?? asNumber(input.ImageWidth),
    height: asNumber(input.ExifImageHeight) ?? asNumber(input.ImageHeight),
  };
}

export async function parseImageExif(
  buffer: Buffer,
  fileLastModified?: Date | null,
): Promise<ParsedExif> {
  const exifr = await import("exifr");
  const raw = await exifr.parse(buffer, {
    pick: [
      "DateTimeOriginal",
      "CreateDate",
      "GPSLatitude",
      "GPSLongitude",
      "Orientation",
      "Model",
      "ImageWidth",
      "ImageHeight",
      "ExifImageWidth",
      "ExifImageHeight",
    ],
  });

  return normalizeExifInput({
    ...(raw ?? {}),
    fileLastModified: fileLastModified ?? null,
  });
}
