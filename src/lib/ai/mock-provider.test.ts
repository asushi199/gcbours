import { describe, expect, it } from "vitest";
import { MockAIProvider } from "@/lib/ai/mock-provider";
import { MemoryAnalysisSchema } from "@/lib/ai/types";
import { createAIProvider, getActiveAIProviderName } from "@/lib/ai/index";

describe("MockAIProvider", () => {
  it("returns schema-valid draft from a user note", async () => {
    const provider = new MockAIProvider();
    const result = await provider.analyzeMemory({
      language: "zh-CN",
      tone: "温柔日记",
      userNote: "我们在江边慢慢走，路灯一盏盏亮起来。",
      excludedDetails: "",
      relationshipContext: "私人情侣档案",
      eventMetadata: {
        eventDate: "2025-05-20",
        placeName: "江边步道",
        photoCount: 3,
      },
      photoObservations: [
        {
          photoId: "00000000-0000-4000-8000-000000000001",
          filename: "a.jpg",
          takenAt: "2025-05-20T18:00:00.000Z",
          latitude: null,
          longitude: null,
        },
      ],
    });

    expect(MemoryAnalysisSchema.safeParse(result).success).toBe(true);
    expect(result.diaryBody.length).toBeGreaterThanOrEqual(50);
    expect(result.questionsToConfirm.length).toBeLessThanOrEqual(5);
  });
});

describe("createAIProvider", () => {
  it("defaults to mock without API key", () => {
    expect(getActiveAIProviderName()).toBe("mock");
    expect(createAIProvider()).toBeInstanceOf(MockAIProvider);
  });
});
