import Link from "next/link";

const experienceLinks = [
  { href: "/", label: "开场" },
  { href: "/story", label: "故事" },
  { href: "/timeline", label: "时间线" },
  { href: "/letter", label: "信件" },
] as const;

export function ExperienceNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-background/85 backdrop-blur-md">
      <nav
        aria-label="体验导航"
        className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-3 py-3 text-xs tracking-wide text-muted-ours sm:px-4 md:gap-3 md:text-sm"
      >
        <Link
          href="/"
          className="mr-1 shrink-0 font-serif text-base tracking-[0.15em] text-ink sm:mr-2"
        >
          OURS
        </Link>
        {experienceLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-md px-2 py-1.5 underline-offset-4 hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/studio"
          className="ml-auto shrink-0 rounded-md px-2 py-1.5 text-ink/70 underline-offset-4 hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Studio
        </Link>
      </nav>
    </header>
  );
}
