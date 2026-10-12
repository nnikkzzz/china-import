import { FALLBACK_RATES } from "./config";
import type { Rates } from "./calc";

type CbrResponse = {
  Date: string;
  Valute: Record<string, { Value: number; Nominal: number }>;
};

// Курсы ЦБ РФ через cbr-xml-daily.ru, кэш 6 часов. При сбое — запасные значения.
export async function getRates(): Promise<Rates> {
  try {
    const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js", {
      next: { revalidate: 21_600 },
      signal: AbortSignal.timeout(4_000),
    });
    if (!res.ok) throw new Error(`CBR ${res.status}`);
    const data = (await res.json()) as CbrResponse;
    const cny = data.Valute.CNY.Value / data.Valute.CNY.Nominal;
    const usd = data.Valute.USD.Value / data.Valute.USD.Nominal;
    if (!(cny > 0 && usd > 0)) throw new Error("CBR: bad values");
    return { cny, usd, date: data.Date, source: "cbr" };
  } catch (err) {
    console.warn("[rates] fallback:", err instanceof Error ? err.message : err);
    return FALLBACK_RATES;
  }
}
