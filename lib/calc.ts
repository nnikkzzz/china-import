import {
  CATEGORIES,
  ESTIMATE_SPREAD,
  CUSTOMS_FEE_TIERS,
  FEES,
  METHODS,
  type CategoryId,
  type MethodId,
} from "./config";

export type Rates = { cny: number; usd: number; date: string; source: "cbr" | "fallback" };

export type CalcInput = {
  category: CategoryId;
  currency: "CNY" | "USD";
  unitPrice: number;
  quantity: number;
  weightKg: number;
  volumeM3: number;
  method: MethodId;
};

export type CalcLine = { key: string; label: string; amount: number; hint?: string; group: "goods" | "logistics" | "customs" | "service" };

export type CalcResult = {
  lines: CalcLine[];
  total: number;
  perUnit: number;
  unitPriceRub: number;
  goodsRub: number;
  chargeableKg: number;
  days: [number, number];
  vatRecoverable: number;
};

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function customsFee(customsValue: number): number {
  for (const [upTo, fee] of CUSTOMS_FEE_TIERS) if (customsValue <= upTo) return fee;
  return CUSTOMS_FEE_TIERS[CUSTOMS_FEE_TIERS.length - 1][1];
}

export function calculate(input: CalcInput, rates: Rates): CalcResult | null {
  const category = CATEGORIES.find((c) => c.id === input.category);
  const method = METHODS.find((m) => m.id === input.method);
  const unitPrice = pos(input.unitPrice);
  const quantity = Math.floor(pos(input.quantity));
  const weightKg = pos(input.weightKg);
  const volumeM3 = pos(input.volumeM3);
  if (!category || !method || !unitPrice || !quantity || !weightKg) return null;

  const rate = input.currency === "CNY" ? rates.cny : rates.usd;
  const unitPriceRub = unitPrice * rate;
  const goodsRub = unitPriceRub * quantity;

  const paymentAgent = goodsRub * FEES.paymentAgent;
  const chinaDelivery = Math.max(goodsRub * FEES.chinaDelivery, FEES.chinaDeliveryMin);
  const chargeableKg = Math.max(weightKg, volumeM3 * method.volumetric, method.minKg);
  const freight = chargeableKg * method.usdPerKg * rates.usd;
  const insurance = (goodsRub + freight) * FEES.insurance;

  const customsValue = goodsRub + chinaDelivery + freight * FEES.freightToBorder;
  const duty = customsValue * (category.duty / 100);
  const vat = (customsValue + duty) * (category.vat / 100);
  const fee = customsFee(customsValue);
  const service = Math.max(goodsRub * FEES.service, FEES.serviceMin);

  const fmtKg = Math.round(chargeableKg).toLocaleString("ru-RU");
  const lines: CalcLine[] = [
    { key: "goods", group: "goods", label: "Товар по курсу ЦБ", amount: goodsRub, hint: `${quantity.toLocaleString("ru-RU")} шт × ${unitPrice.toLocaleString("ru-RU")} ${input.currency === "CNY" ? "¥" : "$"}` },
    { key: "agent", group: "goods", label: "Оплата поставщику в юанях", amount: paymentAgent, hint: `платёжный агент ${FEES.paymentAgent * 100}%` },
    { key: "china", group: "logistics", label: "Доставка по Китаю до склада", amount: chinaDelivery },
    { key: "freight", group: "logistics", label: `Доставка в РФ · ${method.label.toLowerCase()}`, amount: freight, hint: `${fmtKg} кг × $${method.usdPerKg}${chargeableKg > weightKg ? " (по объёму/минимуму)" : ""}` },
    { key: "insurance", group: "logistics", label: "Страхование груза", amount: insurance, hint: `${FEES.insurance * 100}% от товара и фрахта` },
    { key: "duty", group: "customs", label: "Пошлина", amount: duty, hint: `${category.duty}% от таможенной стоимости` },
    { key: "vat", group: "customs", label: "НДС на ввозе", amount: vat, hint: `${category.vat}% · можно принять к вычету` },
    { key: "fee", group: "customs", label: "Таможенный сбор", amount: fee },
    { key: "broker", group: "customs", label: "Декларирование (брокер)", amount: FEES.broker },
    { key: "cert", group: "customs", label: "Сертификация партии", amount: category.certRub, hint: category.note },
    { key: "service", group: "service", label: "Наша работа под ключ", amount: service, hint: `${FEES.service * 100}% от товара, мин. ${FEES.serviceMin.toLocaleString("ru-RU")} ₽` },
  ];

  const total = lines.reduce((s, l) => s + l.amount, 0);
  return {
    lines,
    total,
    perUnit: total / quantity,
    unitPriceRub,
    goodsRub,
    chargeableKg,
    days: method.days,
    vatRecoverable: vat,
  };
}

export const rub = (n: number, digits = 0) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n) + " ₽";

// Округление «по-человечески»: чем больше сумма, тем крупнее шаг.
export function roundNice(n: number): number {
  const step = n >= 1_000_000 ? 10_000 : n >= 100_000 ? 1_000 : n >= 10_000 ? 100 : n >= 1_000 ? 10 : n >= 100 ? 1 : 0.1;
  return Math.round(n / step) * step;
}

const plain = (n: number) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(roundNice(n));

export const rubApprox = (n: number) => `≈ ${plain(n)} ₽`;
export const rubRange = (n: number) => `${plain(n * (1 - ESTIMATE_SPREAD))}–${plain(n * (1 + ESTIMATE_SPREAD))} ₽`;

export function summarize(input: CalcInput, result: CalcResult, rates: Rates): string {
  const category = CATEGORIES.find((c) => c.id === input.category)?.label ?? input.category;
  const method = METHODS.find((m) => m.id === input.method)?.label ?? input.method;
  return [
    `${category}, ${input.quantity} шт × ${input.unitPrice} ${input.currency === "CNY" ? "¥" : "$"}`,
    `${input.weightKg} кг, ${input.volumeM3 || 0} м³, ${method}`,
    `Оценка: ${rubRange(result.total)} (${rubRange(result.perUnit)} за шт)`,
    `Курс ЦБ: ¥ ${rates.cny.toFixed(2)}, $ ${rates.usd.toFixed(2)}`,
  ].join("\n");
}
