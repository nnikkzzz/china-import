import Link from "next/link";
import { BRAND, DEMO_MODE } from "@/lib/config";
import { buttonClass } from "@/components/ui/button";

const NAV = [
  { href: "#how", label: "Как работаем" },
  { href: "#compare", label: "Почему белый импорт" },
  { href: "#pricing", label: "Цены" },
  { href: "#faq", label: "Вопросы" },
];

export function Logo() {
  return (
    <Link href="/#top" className="flex items-center gap-2.5" aria-label={`${BRAND.name} — на главную`}>
      <span className="grid size-9 place-items-center rounded-xl bg-accent font-display text-sm font-bold text-white">
        路
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight">{BRAND.name}</span>
    </Link>
  );
}

export function DemoBanner() {
  if (!DEMO_MODE) return null;
  return (
    <div className="bg-ink px-4 py-2 text-center text-xs leading-relaxed text-white/80">
      <span className="font-semibold text-white">Концепт-проект.</span> Компания, контакты и тарифы вымышлены, расчёт
      демонстрационный, заявки никуда не отправляются.{" "}
      <Link href="/case" className="font-semibold whitespace-nowrap text-white underline underline-offset-2 hover:text-accent">
        Как это сделано →
      </Link>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-ink">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#calculator" className={buttonClass("secondary", "md")}>
          Рассчитать
        </a>
      </div>
    </header>
  );
}
