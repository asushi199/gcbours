import sharp from "sharp";
import { appConfig } from "@/config/app";

const HEIC_MIME = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

async function toDecodableBuffer(
  input: Buffer,
  mimeType: string,
): Promise<Buffer> {
  if (!HEIC_MIME.has(mimeType.toLowerCase())) {
    return input;
  }

  try {
    const convert = (await import("heic-convert")).default;
    const output = await convert({
      buffer: input,
      format: "JPEG",
      quality: 0.9,
    });
    return Buffer.from(output);
  } catch (error) {
    throw new Error(
      `HEIC conversion failed: ${error instanceof Error ? error.message : "unknown error"}`,
    );
  }
}

export async function createJpegThumbnail(input: {
  buffer: Buffer;
  mimeType: string;
  maxEdge?: number;
}) {
  const maxEdge = input.maxEdge ?? appConfig.thumbnailMaxEdge;
  const decoded = await toDecodableBuffer(input.buffer, input.mimeType);

  const image = sharp(decoded, { failOn: "none" }).rotate();
  const meta = await image.metadata();

  const thumbnail = await image
    .resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return {
    buffer: thumbnail,
    mimeType: "image/jpeg" as const,
    width: meta.width ?? null,
    height: meta.height ?? null,
  };
}

export function isAcceptedImageMime(mimeType: string) {
  const allowed = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ]);
  return allowed.has(mimeType.toLowerCase());
}

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
