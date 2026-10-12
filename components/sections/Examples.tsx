import { Section } from "@/components/ui/section";
import { calculate, rub, rubApprox, type CalcInput, type Rates } from "@/lib/calc";
import { METHODS } from "@/lib/config";

const EXAMPLES: Array<{ title: string; input: CalcInput }> = [
  {
    title: "Силиконовые чехлы для смартфонов",
    input: { category: "electronics", currency: "CNY", unitPrice: 6, quantity: 3000, weightKg: 240, volumeM3: 1.4, method: "auto" },
  },
  {
    title: "Женские худи оверсайз",
    input: { category: "clothing", currency: "CNY", unitPrice: 48, quantity: 800, weightKg: 520, volumeM3: 3.2, method: "rail" },
  },
  {
    title: "Органайзеры для кухни",
    input: { category: "home", currency: "CNY", unitPrice: 18, quantity: 1500, weightKg: 900, volumeM3: 6, method: "auto" },
  },
];

// Примеры считаются тем же движком, что и калькулятор, по текущему курсу ЦБ.
export function Examples({ rates }: { rates: Rates }) {
  return (
    <Section
      eyebrow="Примеры расчёта"
      title="Сколько стоит штука на вашем складе"
      intro="Типовые партии с ценами с 1688, посчитанные по сегодняшнему курсу. Хорошая наценка на маркетплейсе — от ×2,5 к себестоимости под ключ."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {EXAMPLES.map(({ title, input }) => {
          const r = calculate(input, rates);
          if (!r) return null;
          const method = METHODS.find((m) => m.id === input.method)!;
          const markup = r.perUnit / r.unitPriceRub;
          return (
            <article key={title} className="flex flex-col rounded-3xl bg-card p-6 ring-1 ring-line">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-ink-mute">
                {input.quantity.toLocaleString("ru-RU")} шт · {input.weightKg} кг · {method.label.toLowerCase()}{" "}
                {method.days[0]}–{method.days[1]} дн
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-paper p-4">
                  <p className="text-xs text-ink-mute">На фабрике</p>
                  <p className="mt-1 text-lg font-bold tabular-nums">{rub(r.unitPriceRub, 2)}</p>
                  <p className="text-xs text-ink-mute">¥{input.unitPrice}</p>
                </div>
                <div className="rounded-2xl bg-ink p-4 text-white">
                  <p className="text-xs text-white/60">Под ключ</p>
                  <p className="mt-1 text-lg font-bold tabular-nums">{rubApprox(r.perUnit)}</p>
                  <p className="text-xs text-white/60">×{markup.toFixed(1)} к цене фабрики</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-ink-soft">
                Вся партия: <span className="font-semibold text-ink">{rubApprox(r.total)}</span>, из них НДС{" "}
                {rubApprox(r.vatRecoverable)} к вычету
              </p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
