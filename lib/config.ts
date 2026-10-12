// Все тарифы и ставки — в одном месте. Цифры ориентировочные: точная пошлина
// определяется по коду ТН ВЭД, логистика — по актуальному прайсу перевозчика.

export const BRAND = {
  name: "Синопуть",
  tagline: "Товары из Китая под ключ",
  phone: "+7 (900) 000-00-00",
  telegram: "@sinoput_demo",
  email: "hello@sinoput.example",
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Концепт-режим (по умолчанию включён): плашка «демо», noindex, форма без реальной отправки.
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

// Разброс оценки калькулятора: итог показываем диапазоном ±12%, а не до копейки.
export const ESTIMATE_SPREAD = 0.12;

export type CategoryId =
  | "electronics"
  | "clothing"
  | "shoes"
  | "home"
  | "kids"
  | "cosmetics"
  | "auto"
  | "tools"
  | "sport";

export type Category = {
  id: CategoryId;
  label: string;
  duty: number; // % пошлины
  vat: number; // % НДС при ввозе
  certRub: number; // декларация / сертификат ЕАЭС на партию
  note: string;
};

export const CATEGORIES: Category[] = [
  { id: "electronics", label: "Электроника и аксессуары", duty: 5, vat: 22, certRub: 25_000, note: "ТР ТС 004/020 — декларация соответствия" },
  { id: "clothing", label: "Одежда и текстиль", duty: 10, vat: 22, certRub: 15_000, note: "Маркировка «Честный знак» обязательна" },
  { id: "shoes", label: "Обувь", duty: 10, vat: 22, certRub: 18_000, note: "Маркировка «Честный знак» обязательна" },
  { id: "home", label: "Дом и кухня", duty: 8, vat: 22, certRub: 15_000, note: "Посуда — ТР ТС 005/007" },
  { id: "kids", label: "Детские товары и игрушки", duty: 5, vat: 10, certRub: 30_000, note: "Льготный НДС 10%, сертификат ТР ТС 007/008" },
  { id: "cosmetics", label: "Косметика и уход", duty: 6.5, vat: 22, certRub: 30_000, note: "ТР ТС 009, нужен протокол испытаний" },
  { id: "auto", label: "Автотовары", duty: 5, vat: 22, certRub: 20_000, note: "Часть позиций — сертификат ТР ТС 018" },
  { id: "tools", label: "Инструменты и оборудование", duty: 3, vat: 22, certRub: 25_000, note: "Электроинструмент — ТР ТС 004/010/020" },
  { id: "sport", label: "Спорт и туризм", duty: 8, vat: 22, certRub: 15_000, note: "Чаще всего — отказное письмо" },
];

export type MethodId = "auto" | "rail" | "air" | "sea";

export type Method = {
  id: MethodId;
  label: string;
  usdPerKg: number;
  days: [number, number];
  volumetric: number; // кг на м³: лёгкий груз считается по объёму
  minKg: number;
};

export const METHODS: Method[] = [
  { id: "auto", label: "Авто", usdPerKg: 2.6, days: [18, 25], volumetric: 200, minKg: 50 },
  { id: "rail", label: "Ж/д", usdPerKg: 2.1, days: [25, 35], volumetric: 250, minKg: 100 },
  { id: "air", label: "Авиа", usdPerKg: 7.5, days: [7, 12], volumetric: 167, minKg: 10 },
  { id: "sea", label: "Море", usdPerKg: 1.2, days: [45, 60], volumetric: 300, minKg: 300 },
];

export const FEES = {
  paymentAgent: 0.025, // оплата поставщику в юанях через платёжного агента
  chinaDelivery: 0.02, // доставка от фабрики до нашего склада
  chinaDeliveryMin: 1_500,
  insurance: 0.01, // от стоимости товара и фрахта
  freightToBorder: 0.7, // доля фрахта, входящая в таможенную стоимость
  broker: 15_000, // таможенный представитель, декларация
  service: 0.05, // наша комиссия
  serviceMin: 15_000,
} as const;

// Таможенный сбор за оформление по таможенной стоимости, ₽.
export const CUSTOMS_FEE_TIERS: Array<[upTo: number, fee: number]> = [
  [200_000, 1_231],
  [450_000, 2_462],
  [1_200_000, 4_924],
  [2_700_000, 13_541],
  [4_200_000, 18_465],
  [5_500_000, 20_924],
  [7_000_000, 27_693],
  [8_000_000, 33_852],
  [9_000_000, 41_846],
  [10_000_000, 49_242],
  [Infinity, 73_860],
];

export const FALLBACK_RATES = { cny: 11.4, usd: 82, date: "", source: "fallback" as const };
