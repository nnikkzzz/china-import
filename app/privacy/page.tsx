import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, DEMO_MODE } from "@/lib/config";
import { DemoBanner, Logo } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: `Как ${BRAND.name} обрабатывает персональные данные из формы заявки.`,
  alternates: { canonical: "/privacy" },
};

// Шаблон под 152-ФЗ. Перед боевым запуском подставить реквизиты оператора
// и подать уведомление в Роскомнадзор.
const OPERATOR = {
  name: "ООО «Синопуть» (реквизиты будут указаны при запуске)",
  inn: "—",
  address: "—",
};

const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "1. Кто обрабатывает данные",
    body: [
      `Оператор персональных данных — ${OPERATOR.name}, ИНН ${OPERATOR.inn}, адрес: ${OPERATOR.address}. Связаться по вопросам обработки данных: ${BRAND.email}.`,
    ],
  },
  {
    title: "2. Какие данные мы получаем",
    body: [
      "Имя, телефон или имя пользователя в Telegram, описание товара и параметры расчёта из калькулятора, которые вы отправляете через форму заявки.",
      "Мы не просим паспортные данные, реквизиты карт и другие специальные категории данных.",
    ],
  },
  {
    title: "3. Зачем",
    body: [
      "Чтобы связаться с вами, уточнить параметры товара и подготовить расчёт стоимости импорта. Данные не используются для рассылок без отдельного согласия.",
    ],
  },
  {
    title: "4. Основание и срок",
    body: [
      "Основание — ваше согласие (п. 1 ч. 1 ст. 6 Федерального закона № 152-ФЗ «О персональных данных»), которое вы даёте, отмечая чекбокс в форме.",
      "Данные хранятся до достижения цели обработки, но не дольше 12 месяцев с момента заявки, либо до отзыва согласия.",
    ],
  },
  {
    title: "5. Где хранятся и кому передаются",
    body: [
      "Запись, систематизация и хранение данных граждан РФ ведутся с использованием баз данных на территории Российской Федерации. Третьим лицам данные передаются только для исполнения вашего запроса (например, таможенному представителю) и только с вашего ведома.",
    ],
  },
  {
    title: "6. Ваши права",
    body: [
      `Вы можете запросить сведения о своих данных, потребовать их уточнения или удаления и отозвать согласие, написав на ${BRAND.email}. Ответим в течение 10 рабочих дней.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <DemoBanner />
      <header className="border-b border-line/70 bg-paper/85">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4 sm:px-6">
          <Logo />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
          Политика конфиденциальности
        </h1>
        {DEMO_MODE && (
          <p className="mt-6 rounded-2xl bg-accent-soft p-4 text-sm leading-relaxed text-accent-dark">
            Это концепт-проект. Форма на сайте ничего не отправляет и не сохраняет, а оператор и реквизиты указаны условно.
          </p>
        )}
        <div className="mt-10 space-y-9">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
        <Link href="/" className="mt-12 inline-flex min-h-11 items-center font-semibold text-accent hover:text-accent-dark">
          ← На главную
        </Link>
      </main>
      <Footer />
    </>
  );
}
