import { z } from "zod";

export const MemoryAnalysisSchema = z.object({
  title: z.string().min(1).max(80),
  subtitle: z.string().max(120).nullable(),
  oneLine: z.string().min(1).max(160),
  diaryBody: z.string().min(50).max(3000),

  mood: z.enum([
    "warm",
    "joyful",
    "quiet",
    "romantic",
    "playful",
    "nostalgic",
    "adventurous",
  ]),

  tags: z.array(z.string()).max(8),

  placeSuggestion: z.string().nullable(),

  chapterSuggestion: z.enum([
    "beginning",
    "ordinary_days",
    "journeys",
    "celebrations",
    "food_and_places",
    "growing_together",
    "future",
  ]),

  templateSuggestion: z.string(),

  photoRoles: z.array(
    z.object({
      photoId: z.string().min(1),
      role: z.enum([
        "cover",
        "hero",
        "portrait",
        "candid",
        "food",
        "place",
        "detail",
      ]),
      cropFocus: z.enum(["center", "face", "top", "bottom", "left", "right"]),
    }),
  ).catch([]),

  confidence: z.number().min(0).max(1),

  questionsToConfirm: z.array(z.string()).max(5),

  inferredFacts: z.array(z.string()).max(10),
});

export type MemoryAnalysisResult = z.infer<typeof MemoryAnalysisSchema>;

export type MemoryAnalysisInput = {
  language: string;
  tone: string;
  userNote: string;
  excludedDetails: string;
  relationshipContext: string;
  eventMetadata: {
    eventDate: string;
    placeName: string | null;
    photoCount: number;
  };
  photoObservations: Array<{
    photoId: string;
    filename: string;
    takenAt: string | null;
    latitude: number | null;
    longitude: number | null;
  }>;
  /** Optional low-res JPEG data URLs for multimodal providers */
  analysisImageDataUrls?: string[];
};

export interface AIProvider {
  analyzeMemory(input: MemoryAnalysisInput): Promise<MemoryAnalysisResult>;
}
