import { ArrowDown, Camera, FileCheck2, Lock, ShieldCheck } from "lucide-react";
import { Calculator } from "@/components/Calculator";
import type { Rates } from "@/lib/calc";

const PROMISES = [
  { icon: FileCheck2, text: "Документы и НДС для WB и Ozon" },
  { icon: Lock, text: "Итоговая цена — в договоре" },
  { icon: Camera, text: "Фото и видео партии до отгрузки" },
  { icon: ShieldCheck, text: "Груз застрахован на 100%" },
];

export function Hero({ rates }: { rates: Rates }) {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-10 pb-20 sm:px-6 md:pt-16 md:pb-28">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
      <div className="relative mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_minmax(0,480px)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
        <div className="animate-rise lg:col-start-1 lg:row-start-1 lg:pt-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-line">
            <span className="size-1.5 rounded-full bg-jade" />
            Импорт из Китая для селлеров и бизнеса
          </p>
          <h1 className="mt-6 font-display text-[2.1rem] leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
            Товар из Китая на&nbsp;вашем складе. <span className="text-accent">Цену знаете до оплаты</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty">
            Найдём фабрику, проверим партию, привезём и растаможим в белую. Пошлина, НДС, сертификаты и доставка уже
            в одной сумме, без доплат на границе.
          </p>
        </div>

        <div className="animate-rise [animation-delay:120ms] lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Calculator rates={rates} />
        </div>

        <div className="animate-rise [animation-delay:200ms] lg:col-start-1 lg:row-start-2">
          <ul className="grid max-w-xl gap-3 sm:grid-cols-2">
            {PROMISES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card ring-1 ring-line">
                  <Icon className="size-4 text-accent" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <a
            href="#how"
            className="mt-8 hidden items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-ink lg:inline-flex"
          >
            <ArrowDown className="size-4" /> Как мы работаем
          </a>
        </div>
      </div>
    </section>
  );
}
