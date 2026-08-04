import { ExperienceNav } from "@/components/experience/experience-nav";
import { PageTransition } from "@/components/motion/page-transition";

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <ExperienceNav />
      <main className="flex flex-1 flex-col">
        <PageTransition className="flex flex-1 flex-col">{children}</PageTransition>
      </main>
    </div>
  );
}
