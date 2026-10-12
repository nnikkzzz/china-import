import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("px-4 py-20 sm:px-6 md:py-28", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-4 text-xs font-bold tracking-[0.18em] text-accent uppercase">{eyebrow}</p>
          )}
          <h2 className="font-display text-[1.75rem] leading-[1.15] font-semibold tracking-tight text-balance md:text-[2.5rem]">
            {title}
          </h2>
          {intro && <p className="mt-5 text-lg leading-relaxed text-ink-soft text-pretty">{intro}</p>}
        </div>
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
