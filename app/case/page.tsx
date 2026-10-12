import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { CalcProvider } from "@/components/calc-context";
import { Calculator } from "@/components/Calculator";
import { DemoBanner, Logo } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { buttonClass } from "@/components/ui/button";
import { ESTIMATE_SPREAD, FEES } from "@/lib/config";
import { getRates } from "@/lib/rates";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Кейс: лендинг-калькулятор импорта из Китая",
  description:
    "Как устроен лендинг с калькулятором итоговой стоимости импорта: курс ЦБ, пошлина, НДС, логистика и сертификация в одной цифре. Next.js 15, TypeScript, Tailwind.",
  alternates: { canonical: "/case" },
};

const REPO_URL = "https://github.com/nnikkzzz/china-import";

const pct = (n: number) => `${+(n * 100).toFixed(1)}%`;

const FACTS = [
  { k: "Тип", v: "Лендинг + калькулятор" },
  { k: "Статус", v: "Концепт для портфолио" },
  { k: "Стек", v: "Next.js 15 · TS · Tailwind v4" },
  { k: "Хостинг", v: "Vercel, ISR раз в 6 часов" },
];

const PIPELINE = [
  { title: "Товар по курсу ЦБ", formula: "цена × количество × курс ¥ или $", note: "Курс тянется с cbr-xml-daily.ru на сервере, при сбое — запасной" },
  { title: "Оплата фабрике", formula: `+ ${pct(FEES.paymentAgent)} платёжному агенту`, note: "Клиент платит рублями, фабрика получает юани" },
  { title: "Логистика", formula: "max(вес, объём × плотность, минимум) × $/кг", note: "Лёгкий объёмный груз считается по кубам, как у перевозчиков" },
  { title: "Таможенная стоимость", formula: `товар + доставка по Китаю + ${pct(FEES.freightToBorder)} фрахта`, note: "Фрахт до границы входит в базу для пошлины" },
  { title: "Пошлина и НДС", formula: "пошлина % × ТС, НДС % × (ТС + пошлина)", note: "Ставки по категориям, НДС 22% (детские — 10%)" },
  { title: "Фиксированные расходы", formula: "+ таможенный сбор по шкале + брокер + сертификат", note: "Они и делают маленькие партии невыгодными — это видно в цифрах" },
  { title: "Итог", formula: `сумма ± ${pct(ESTIMATE_SPREAD)} → диапазон`, note: "Не до копейки: тарифы средние, и это честно показано" },
];

const DECISIONS = [
  {
    title: "Калькулятор вместо формы «оставьте заявку»",
    text: "Человек сначала получает ответ на главный вопрос — сколько это будет стоить, — и только потом оставляет контакт. Расчёт сам прикрепляется к заявке, менеджеру не нужно переспрашивать параметры.",
  },
  {
    title: "Четыре способа доставки сразу",
    text: "Цена и срок авто, ж/д, авиа и моря видны на кнопках одновременно. Выбор «быстро или дёшево» делается за секунду, без перебора.",
  },
  {
    title: "Диапазон, а не точная цифра",
    text: "Оценка на средних тарифах, показанная до копейки, выглядит как обещание. Диапазон ±12% честнее и снимает спор «а у вас на сайте было другое».",
  },
  {
    title: "Доказательства без выдуманных отзывов",
    text: "У концепта нет клиентов, поэтому вместо отзывов — сравнение «карго против белого импорта» и примеры расчёта, посчитанные тем же движком по сегодняшнему курсу.",
  },
  {
    title: "Один флаг для концепт-режима",
    text: "NEXT_PUBLIC_DEMO_MODE включает плашку, noindex и форму без отправки. В боевом режиме без настроенного Telegram форма отвечает ошибкой, а не «успехом», — заявки не теряются молча.",
  },
  {
    title: "Мобильный первый экран",
    text: "На телефоне калькулятор начинается в пределах первого экрана: вторичные буллеты вынесены под него отдельным элементом сетки.",
  },
];

const ENGINEERING = [
  "Движок расчёта — чистая функция в lib/calc.ts, все тарифы — в одном lib/config.ts",
  "Страница статическая с ISR: курс ЦБ обновляется раз в 6 часов без клиентского JS",
  "Zod-схема заявки общая для формы и Route Handler, honeypot и rate limit",
  "Server Components для секций, client — только калькулятор и форма",
  "OG-картинка генерируется next/og с живым примером расчёта",
  "SEO: metadata, JSON-LD FAQPage, sitemap, страница политики под 152-ФЗ",
];

const NEXT = [
  "Реальные тарифы партнёра-перевозчика вместо средних",
  "Каталог ходовых товаров с весом и габаритами за штуку",
  "Оценка веса и кода ТН ВЭД по названию или фото через Claude API",
  "Подтягивание цены по ссылке на 1688 через сторонний API",
];

export default async function CasePage() {
  const rates = await getRates();
  return (
    <CalcProvider>
      <DemoBanner />
      <header className="border-b border-line/70 bg-paper/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link href="/" className={buttonClass("secondary", "md")}>
            Лендинг <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </header>

      <main>
        <section className="px-4 pt-14 pb-16 sm:px-6 md:pt-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold tracking-[0.18em] text-accent uppercase">Кейс</p>
            <h1 className="mt-4 max-w-4xl font-display text-[2rem] leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl">
              Лендинг импорта из Китая, где цена видна до заявки
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
              «Белый» импорт дороже карго за килограмм, но дешевле в итоге. Задача лендинга — показать это цифрами: собрать
              курс, логистику, пошлину, НДС и сертификацию в одну сумму прямо на первом экране.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {FACTS.map((f) => (
                <div key={f.k} className="rounded-2xl bg-card p-4 ring-1 ring-line">
                  <dt className="text-xs text-ink-mute">{f.k}</dt>
                  <dd className="mt-1 text-sm font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-16">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Как считается итог</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Тот же движок работает в калькуляторе рядом, в примерах на лендинге и в OG-картинке. Поменяйте параметры
                и посмотрите детализацию.
              </p>
              <ol className="mt-8 space-y-3">
                {PIPELINE.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-2xl bg-card p-4 ring-1 ring-line">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold">{s.title}</p>
                      <p className="mt-1 font-mono text-[13px] break-words text-ink">{s.formula}</p>
                      <p className="mt-1 text-sm text-ink-mute">{s.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:sticky lg:top-6">
              <Calculator rates={rates} embed />
            </div>
          </div>
        </section>

        <section className="bg-card px-4 py-20 sm:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Ключевые решения</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {DECISIONS.map((d) => (
                <article key={d.title} className="rounded-3xl bg-paper p-6">
                  <h3 className="font-semibold">{d.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{d.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">Инженерия</h2>
              <ul className="mt-6 space-y-3">
                {ENGINEERING.map((t) => (
                  <li key={t} className="flex gap-3 text-ink-soft">
                    <Check className="mt-1 size-4 shrink-0 text-jade" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">Что дальше</h2>
              <ul className="mt-6 space-y-3">
                {NEXT.map((t, i) => (
                  <li key={t} className="flex gap-3 text-ink-soft">
                    <span className="mt-0.5 w-5 shrink-0 text-sm font-bold text-accent tabular-nums">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-3 sm:flex-row">
            <Link href="/" className={buttonClass("primary", "lg")}>
              Открыть лендинг <ArrowUpRight className="size-4" />
            </Link>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost", "lg")}>
              Код на GitHub <ArrowUpRight className="size-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </CalcProvider>
  );
}
