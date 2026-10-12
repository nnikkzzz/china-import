import Link from "next/link";
import { BRAND } from "@/lib/config";
import { Logo } from "@/components/Header";

export function Footer() {
  return (
    <footer className="border-t border-line px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink-mute">
            {BRAND.tagline}: поиск фабрик, контроль качества, логистика и белая растаможка.
          </p>
        </div>
        <div className="grid gap-1 text-sm">
          <a href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`} className="font-semibold hover:text-accent">
            {BRAND.phone}
          </a>
          <a href={`https://t.me/${BRAND.telegram.slice(1)}`} className="text-ink-soft hover:text-accent">
            Telegram {BRAND.telegram}
          </a>
          <a href={`mailto:${BRAND.email}`} className="text-ink-soft hover:text-accent">
            {BRAND.email}
          </a>
          <Link href="/case" className="mt-2 text-ink-mute hover:text-accent">
            Кейс: как сделан лендинг
          </Link>
          <Link href="/privacy" className="text-ink-mute hover:text-accent">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs leading-relaxed text-ink-mute">
        © {new Date().getFullYear()} {BRAND.name}. Демонстрационный проект: компания, контакты и тарифы вымышлены. Расчёт
        калькулятора ориентировочный и не является публичной офертой.
      </p>
    </footer>
  );
}
