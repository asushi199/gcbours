import { MemoryPhotoGalleryProvider } from "@/components/photo-viewer/gallery-context";
import type {
  MemoryLayoutProps,
  MemoryTemplateDefinition,
} from "@/types/memory";
import type { ComponentType } from "react";
import { EditorialHeroLayout } from "@/components/memory-layouts/editorial-hero";
import { FilmStripLayout } from "@/components/memory-layouts/film-strip";
import { FullBleedQuoteLayout } from "@/components/memory-layouts/full-bleed-quote";
import { PolaroidStackLayout } from "@/components/memory-layouts/polaroid-stack";
import { SplitStoryLayout } from "@/components/memory-layouts/split-story";
import { ThreePhotoJournalLayout } from "@/components/memory-layouts/three-photo-journal";

export const memoryTemplates: Array<
  MemoryTemplateDefinition & {
    component: ComponentType<MemoryLayoutProps>;
  }
> = [
  {
    id: "editorial-hero",
    name: "杂志封面",
    description: "大图开场，适合有强封面的回忆",
    minPhotos: 1,
    maxPhotos: 6,
    preferredOrientations: ["landscape", "portrait"],
    supportedMoods: ["warm", "romantic", "nostalgic", "quiet"],
    component: EditorialHeroLayout,
  },
  {
    id: "split-story",
    name: "左图右文",
    description: "图片与日记并列阅读",
    minPhotos: 2,
    maxPhotos: 5,
    preferredOrientations: ["portrait", "square"],
    supportedMoods: ["warm", "quiet", "playful"],
    component: SplitStoryLayout,
  },
  {
    id: "polaroid-stack",
    name: "拍立得叠放",
    description: "手账感叠放照片",
    minPhotos: 2,
    maxPhotos: 4,
    preferredOrientations: ["portrait", "square"],
    supportedMoods: ["playful", "joyful", "nostalgic"],
    component: PolaroidStackLayout,
  },
  {
    id: "three-photo-journal",
    name: "三图日记",
    description: "三列照片 + 正文",
    minPhotos: 3,
    maxPhotos: 3,
    preferredOrientations: ["portrait"],
    supportedMoods: ["warm", "quiet", "adventurous"],
    component: ThreePhotoJournalLayout,
  },
  {
    id: "full-bleed-quote",
    name: "全幅引言",
    description: "一句话压在全幅画面上",
    minPhotos: 1,
    maxPhotos: 3,
    preferredOrientations: ["landscape"],
    supportedMoods: ["romantic", "quiet", "nostalgic"],
    component: FullBleedQuoteLayout,
  },
  {
    id: "film-strip",
    name: "胶片条",
    description: "横向胶片浏览",
    minPhotos: 3,
    maxPhotos: 12,
    preferredOrientations: ["landscape", "portrait"],
    supportedMoods: ["nostalgic", "adventurous", "joyful"],
    component: FilmStripLayout,
  },
];

export function getTemplate(id: string) {
  return memoryTemplates.find((template) => template.id === id) ?? memoryTemplates[0];
}

export function MemoryLayoutRenderer(props: MemoryLayoutProps) {
  const template = getTemplate(props.memory.templateId);
  const Component = template.component;
  return (
    <MemoryPhotoGalleryProvider photos={props.photos}>
      <Component {...props} />
    </MemoryPhotoGalleryProvider>
  );
}

export function scoreTemplate(
  templateId: string,
  photoCount: number,
  mood?: string,
): number {
  const template = getTemplate(templateId);
  let score = 0;

  if (photoCount >= template.minPhotos && photoCount <= template.maxPhotos) {
    score += 3;
  } else if (photoCount >= template.minPhotos) {
    score += 1;
  }

  if (mood && template.supportedMoods.includes(mood)) {
    score += 2;
  }

  return score;
}
