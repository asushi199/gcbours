import { scoreTemplate, memoryTemplates } from "@/features/templates/registry";
import type { AIProvider, MemoryAnalysisInput, MemoryAnalysisResult } from "@/lib/ai/types";

function pickTemplate(input: MemoryAnalysisInput, mood: MemoryAnalysisResult["mood"]) {
  let best = memoryTemplates[0].id;
  let bestScore = -1;
  for (const template of memoryTemplates) {
    const score = scoreTemplate(template.id, input.eventMetadata.photoCount, mood);
    if (score > bestScore) {
      bestScore = score;
      best = template.id;
    }
  }
  return best;
}

export class MockAIProvider implements AIProvider {
  async analyzeMemory(input: MemoryAnalysisInput): Promise<MemoryAnalysisResult> {
    const note = input.userNote.trim();
    const place = input.eventMetadata.placeName;
    const date = input.eventMetadata.eventDate;

    const diaryBody = [
      note
        ? note
        : `${date} 这一天被放进了我们的档案。`,
      place ? `地点写着：${place}。不确定的细节先不编造。` : "地点若还不清楚，就先留白。",
      "光线、脚步和并肩的片刻，比任何漂亮句子都更值得保存。",
      input.excludedDetails
        ? "按你的要求，敏感内容没有写进正文。"
        : "如果有需要确认的地方，会列在问题里。",
      "这是一份草稿，等你改完再决定要不要发布。",
    ]
      .join("\n\n")
      .slice(0, 3000);

    // Ensure min length 50
    const padded =
      diaryBody.length >= 50
        ? diaryBody
        : `${diaryBody}\n\n我们把这一天轻轻放好，留给以后慢慢回看。`;

    const mood = note.includes("笑")
      ? "joyful"
      : note.includes("雨")
        ? "quiet"
        : "warm";

    const questionsToConfirm: string[] = [];
    if (!place) {
      questionsToConfirm.push("这一天的地点要写成哪里？");
    }
    if (!note) {
      questionsToConfirm.push("想补一句当天真实发生的事吗？");
    }

    return {
      title: note ? note.slice(0, 24) || `${date} 的记录` : `${date} 的记录`,
      subtitle: place,
      oneLine: note
        ? note.slice(0, 160)
        : "有些瞬间不需要修饰，记下来就够了。",
      diaryBody: padded,
      mood,
      tags: ["日常", place ? "地点" : "待确认"].slice(0, 8),
      placeSuggestion: place,
      chapterSuggestion: place ? "food_and_places" : "ordinary_days",
      templateSuggestion: pickTemplate(input, mood),
      photoRoles: input.photoObservations.map((photo, index) => ({
        photoId: photo.photoId,
        role: index === 0 ? "cover" : "detail",
        cropFocus: "center" as const,
      })),
      confidence: note ? 0.72 : 0.45,
      questionsToConfirm: questionsToConfirm.slice(0, 5),
      inferredFacts: note
        ? [`用户备注提到：${note.slice(0, 80)}`]
        : ["仅有日期与照片元数据，正文偏克制"],
    };
  }
}
