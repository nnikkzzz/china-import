import { Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Доставка и растаможка",
    price: "0%",
    sub: "от стоимости товара",
    desc: "Поставщик у вас уже есть. Забираем груз со склада в Китае и везём в белую.",
    features: ["Консолидация на складе в Китае", "Логистика и страховка", "Декларирование и сертификация", "Платите только за услуги по прайсу"],
    featured: false,
  },
  {
    name: "Под ключ",
    price: "5%",
    sub: "от стоимости товара, мин. 15 000 ₽",
    desc: "Весь путь: от поиска фабрики до вашего склада. Подходит для первой партии.",
    features: ["Поиск и проверка 3–5 фабрик", "Образцы и переговоры", "Оплата поставщику в юанях", "Инспекция качества с фото и видео", "Всё из тарифа «Доставка»"],
    featured: true,
  },
  {
    name: "Постоянный импорт",
    price: "3%",
    sub: "при закупках от 3 млн ₽ в месяц",
    desc: "Для регулярных поставок: персональный менеджер и приоритет на складе.",
    features: ["Всё из тарифа «Под ключ»", "Отсрочка оплаты услуг", "Приоритетная консолидация", "Ежемесячный отчёт по себестоимости"],
    featured: false,
  },
];

export function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="Цены"
      title="Платите за работу, а не за неизвестность"
      intro="Пошлина, НДС и логистика уходят по факту, с чеками и закрывающими документами. Наш заработок — только комиссия из тарифа."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={cn(
              "flex flex-col rounded-[28px] p-7 ring-1",
              p.featured ? "bg-ink text-white ring-ink lg:-my-3 lg:py-10" : "bg-card ring-line",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">{p.name}</h3>
              {p.featured && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold">Чаще выбирают</span>
              )}
            </div>
            <p className="mt-6 font-display text-5xl font-semibold">{p.price}</p>
            <p className={cn("mt-2 text-sm", p.featured ? "text-white/60" : "text-ink-mute")}>{p.sub}</p>
            <p className={cn("mt-5 text-sm leading-relaxed", p.featured ? "text-white/80" : "text-ink-soft")}>{p.desc}</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check className={cn("mt-0.5 size-4 shrink-0", p.featured ? "text-accent" : "text-jade")} />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#lead"
              className={cn(
                "mt-8",
                p.featured ? buttonClass("primary", "lg", "w-full") : buttonClass("ghost", "lg", "w-full"),
              )}
            >
              Обсудить партию
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}
