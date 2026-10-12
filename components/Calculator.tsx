"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Info, Paperclip } from "lucide-react";
import { CATEGORIES, METHODS, type CategoryId, type MethodId } from "@/lib/config";
import { calculate, rub, rubApprox, rubRange, summarize, type CalcInput, type CalcLine, type Rates } from "@/lib/calc";
import { useAttachedCalc } from "@/components/calc-context";
import { Button, buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GROUPS: Array<{ id: CalcLine["group"]; label: string }> = [
  { id: "goods", label: "Товар" },
  { id: "logistics", label: "Логистика" },
  { id: "customs", label: "Таможня и документы" },
  { id: "service", label: "Сервис" },
];

const num = (s: string) => {
  const n = parseFloat(s.replace(",", ".").replace(/\s/g, ""));
  return Number.isFinite(n) ? n : 0;
};

// embed — калькулятор на странице кейса: вместо заявки ведёт на лендинг.
export function Calculator({ rates, embed = false }: { rates: Rates; embed?: boolean }) {
  const { attach } = useAttachedCalc();
  const [category, setCategory] = useState<CategoryId>("home");
  const [currency, setCurrency] = useState<"CNY" | "USD">("CNY");
  const [unitPrice, setUnitPrice] = useState("18");
  const [quantity, setQuantity] = useState("1000");
  const [weight, setWeight] = useState("600");
  const [volume, setVolume] = useState("4");
  const [method, setMethod] = useState<MethodId>("auto");
  const [open, setOpen] = useState(false);

  const base = useMemo(
    () => ({ category, currency, unitPrice: num(unitPrice), quantity: num(quantity), weightKg: num(weight), volumeM3: num(volume) }),
    [category, currency, unitPrice, quantity, weight, volume],
  );
  const byMethod = useMemo(
    () => Object.fromEntries(METHODS.map((m) => [m.id, calculate({ ...base, method: m.id }, rates)])),
    [base, rates],
  );
  const input: CalcInput = { ...base, method };
  const result = byMethod[method];
  const cat = CATEGORIES.find((c) => c.id === category)!;

  const onRequest = () => {
    if (result) attach(summarize(input, result, rates));
    document.getElementById("lead")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      id={embed ? undefined : "calculator"}
      className="rounded-[28px] bg-card p-5 shadow-[0_30px_80px_-30px_rgb(18_22_29/0.35)] ring-1 ring-line sm:p-7"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <h2 className="font-display text-lg font-semibold">Калькулятор под ключ</h2>
        <span className="text-xs text-ink-mute">
          {rates.source === "cbr" ? "курс ЦБ" : "примерный курс"} · ¥ {rates.cny.toFixed(2)} · $ {rates.usd.toFixed(2)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Field label="Категория товара" className="col-span-2">
          {(id) => (
            <div className="relative">
              <select
                id={id}
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className={cn(inputCls, "appearance-none pr-10")}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-mute" />
            </div>
          )}
        </Field>

        <Field label="Цена за штуку" className="col-span-2 sm:col-span-1">
          {(id) => (
            <div className="relative">
              <input
                id={id}
                inputMode="decimal"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className={cn(inputCls, "pr-[5.5rem]")}
              />
              <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 rounded-full bg-paper p-0.5 text-xs font-bold">
                {(["CNY", "USD"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={currency === c}
                    onClick={() => setCurrency(c)}
                    className={cn(
                      "h-8 w-9 rounded-full transition-colors",
                      currency === c ? "bg-ink text-white" : "text-ink-mute hover:text-ink",
                    )}
                  >
                    {c === "CNY" ? "¥" : "$"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Field>

        <Field label="Количество, шт">
          {(id) => <input id={id} inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputCls} />}
        </Field>
        <Field label="Вес партии, кг">
          {(id) => <input id={id} inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputCls} />}
        </Field>
        <Field label="Объём, м³" hint="не знаете — оставьте 0">
          {(id) => <input id={id} inputMode="decimal" value={volume} onChange={(e) => setVolume(e.target.value)} className={inputCls} />}
        </Field>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-xs font-semibold text-ink-soft">Способ доставки</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {METHODS.map((m) => {
            const r = byMethod[m.id];
            const active = method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={active}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "min-h-11 rounded-2xl px-3 py-2.5 text-left ring-1 transition-all ring-inset",
                  active ? "bg-ink text-white ring-ink" : "bg-paper/60 ring-line hover:ring-ink/30",
                )}
              >
                <span className="block text-sm font-bold">{m.label}</span>
                <span className={cn("block text-xs", active ? "text-white/70" : "text-ink-mute")}>
                  {m.days[0]}–{m.days[1]} дн
                </span>
                <span className={cn("mt-1 block text-xs font-semibold tabular-nums", active ? "text-white" : "text-ink-soft")}>
                  {r ? rubApprox(r.total) : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 rounded-2xl bg-paper p-5" aria-live="polite">
        {result ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
              <div>
                <p className="text-xs font-semibold text-ink-soft">Оценка под ключ, до вашего склада</p>
                <p className="font-display text-[1.6rem] leading-tight font-semibold tabular-nums sm:text-[1.85rem]">
                  {rubRange(result.total)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-soft">за штуку</p>
                <p className="text-lg font-bold tabular-nums">{rubRange(result.perUnit)}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              На фабрике — {rub(result.unitPriceRub, 2)}, под ключ — {rubApprox(result.perUnit)} за штуку. Срок{" "}
              {result.days[0]}–{result.days[1]} дней.
            </p>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-accent hover:text-accent-dark"
            >
              {open ? "Скрыть детализацию" : "Из чего складывается цена"}
              <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
            </button>

            {open && (
              <div className="mt-2 space-y-4 border-t border-line pt-4">
                {GROUPS.map((g) => (
                  <div key={g.id}>
                    <p className="mb-1.5 text-[11px] font-bold tracking-wider text-ink-mute uppercase">{g.label}</p>
                    <ul className="space-y-1.5">
                      {result.lines
                        .filter((l) => l.group === g.id)
                        .map((l) => (
                          <li key={l.key} className="flex justify-between gap-3 text-sm">
                            <span>
                              {l.label}
                              {l.hint && <span className="block text-xs text-ink-mute">{l.hint}</span>}
                            </span>
                            <span className="shrink-0 font-semibold tabular-nums">{rubApprox(l.amount)}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
                <p className="flex gap-2 rounded-xl bg-jade-soft p-3 text-xs leading-relaxed text-jade">
                  <Info className="mt-px size-4 shrink-0" />
                  Компания на ОСНО вернёт НДС {rubApprox(result.vatRecoverable)} вычетом. {cat.note}.
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="py-4 text-sm text-ink-soft">Укажите цену, количество и вес — посчитаем итоговую стоимость.</p>
        )}
      </div>

      {embed ? (
        <Link href="/#calculator" className={buttonClass("primary", "lg", "mt-5 w-full")}>
          Открыть на лендинге <ArrowUpRight className="size-4" />
        </Link>
      ) : (
        <Button size="lg" className="mt-5 w-full" onClick={onRequest} disabled={!result}>
          <Paperclip className="size-4" />
          Получить точный расчёт
        </Button>
      )}
      <p className="mt-3 text-center text-xs text-ink-mute">
        Оценка ±12% по средним тарифам: точная пошлина зависит от кода ТН ВЭД, логистика — от реальных габаритов.
      </p>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl bg-paper/60 px-3.5 text-base font-semibold text-ink ring-1 ring-line outline-none ring-inset transition focus:bg-card focus:ring-2 focus:ring-accent";

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-semibold text-ink-soft">
        {label}
        {hint && <span className="font-normal text-ink-mute">{hint}</span>}
      </label>
      {children(id)}
    </div>
  );
}
