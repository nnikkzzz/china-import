import { Section } from "@/components/ui/section";

const STEPS = [
  {
    title: "Заявка и расчёт",
    time: "1 день",
    text: "Пришлите ссылку или фото товара. Подберём код ТН ВЭД, посчитаем пошлину, логистику и сертификацию, итог зафиксируем в договоре.",
  },
  {
    title: "Поиск и проверка фабрики",
    time: "3–7 дней",
    text: "Сравним 3–5 поставщиков, проверим лицензию и отзывы, закажем образцы. Переговоры ведём на китайском.",
  },
  {
    title: "Выкуп и производство",
    time: "по сроку фабрики",
    text: "Вы платите рублями по счёту российской компании, мы рассчитываемся с фабрикой в юанях и следим за сроками.",
  },
  {
    title: "Контроль качества",
    time: "1–2 дня",
    text: "На складе в Китае пересчитываем партию, вскрываем выборку и снимаем фото и видео. Брак отправляем обратно фабрике до отгрузки.",
  },
  {
    title: "Доставка и растаможка",
    time: "7–60 дней",
    text: "Везём авто, ж/д, авиа или морем. Декларируем груз, платим пошлину и НДС и доставляем на ваш склад или в фулфилмент.",
  },
];

export function Steps() {
  return (
    <Section
      id="how"
      eyebrow="Как работаем"
      title="Пять шагов от ссылки на 1688 до товара на складе"
      intro="На каждом этапе вы знаете, где груз и что с ним происходит. Отчёты приходят в Telegram."
    >
      <ol className="grid gap-4 md:grid-cols-5">
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative rounded-3xl bg-card p-6 ring-1 ring-line">
            <span className="font-display text-4xl font-semibold text-accent/25 tabular-nums">0{i + 1}</span>
            <h3 className="mt-4 font-semibold leading-snug">{s.title}</h3>
            <p className="mt-1 text-xs font-bold tracking-wide text-accent uppercase">{s.time}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
