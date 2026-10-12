import { Clock, MessageCircle, Scale } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { BRAND } from "@/lib/config";

const NEXT = [
  { icon: Clock, text: "Ответим в течение рабочего дня" },
  { icon: Scale, text: "Сравним 2–3 фабрики и способа доставки" },
  { icon: MessageCircle, text: "Пришлём расчёт в Telegram или на почту" },
];

export function FinalCta() {
  return (
    <section id="lead" className="px-4 pb-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[36px] bg-ink p-6 text-white sm:p-10 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-16 lg:p-14">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-accent uppercase">Первый шаг</p>
          <h2 className="mt-4 font-display text-[1.75rem] leading-[1.15] font-semibold tracking-tight text-balance md:text-[2.5rem]">
            Пришлите ссылку на товар — посчитаем за 1 день
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            Ни к чему не обязывает. Если окажется, что везти невыгодно, так и скажем.
          </p>
          <ul className="mt-8 space-y-4">
            {NEXT.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-white/10">
                  <Icon className="size-4 text-accent" />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-white/60">
            Удобнее сразу в мессенджер?{" "}
            <a href={`https://t.me/${BRAND.telegram.slice(1)}`} className="font-semibold text-white underline-offset-4 hover:underline">
              Напишите в Telegram {BRAND.telegram}
            </a>
          </p>
        </div>
        <div className="text-ink">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
