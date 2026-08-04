import { ExperienceNav } from "@/components/experience/experience-nav";

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <ExperienceNav />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
