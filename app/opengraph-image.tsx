import { ImageResponse } from "next/og";
import { BRAND, ESTIMATE_SPREAD } from "@/lib/config";
import { calculate } from "@/lib/calc";
import { getRates } from "@/lib/rates";
import { OG_COLORS as C, OG_FONT, OG_SIZE, OgLogo, loadOgFonts } from "@/lib/og";

export const alt = `${BRAND.name} — товары из Китая под ключ с калькулятором итоговой стоимости`;
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 21600;

// В woff-шрифтах fontsource нет глифа ₽ — пишем «тыс. руб.».
const thousands = (n: number) => Math.round(n / 1000).toLocaleString("ru-RU");
const rangeK = (n: number) => `${thousands(n * (1 - ESTIMATE_SPREAD))}–${thousands(n * (1 + ESTIMATE_SPREAD))} тыс. руб.`;

const ROWS = ["Товар по курсу ЦБ", "Логистика и страховка", "Пошлина и НДС", "Сертификация и брокер"];

export default async function Image() {
  const [fonts, rates] = await Promise.all([loadOgFonts(), getRates()]);
  const sample = calculate(
    { category: "home", currency: "CNY", unitPrice: 18, quantity: 1000, weightKg: 600, volumeM3: 4, method: "auto" },
    rates,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.paper,
          backgroundImage: `linear-gradient(to right, rgba(18,22,29,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,22,29,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          padding: "64px 72px",
          fontFamily: OG_FONT.body,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 48 }}>
          <OgLogo name={BRAND.name} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: OG_FONT.display, fontSize: 50, lineHeight: 1.1, color: C.ink, letterSpacing: -1 }}>
              Товар из Китая на вашем складе.
            </div>
            <div style={{ fontFamily: OG_FONT.display, fontSize: 50, lineHeight: 1.1, color: C.accent, letterSpacing: -1, marginTop: 4 }}>
              Цену знаете до оплаты
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: C.soft }}>
            Белая растаможка, НДС и документы для маркетплейсов
          </div>
        </div>

        <div
          style={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRadius: 32,
            border: `2px solid ${C.line}`,
            padding: 36,
            boxShadow: "0 30px 80px -30px rgba(18,22,29,0.35)",
          }}
        >
          <div style={{ fontFamily: OG_FONT.display, fontSize: 21, color: C.ink }}>Калькулятор под ключ</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26, gap: 16 }}>
            {ROWS.map((r) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: C.soft }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: C.accent }} />
                {r}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "auto",
              background: C.paper,
              borderRadius: 22,
              padding: "22px 24px",
            }}
          >
            <div style={{ fontSize: 18, color: C.mute }}>Оценка под ключ · 1000 шт</div>
            <div style={{ fontWeight: 700, fontSize: 30, color: C.ink, marginTop: 6, whiteSpace: "nowrap" }}>
              {sample ? rangeK(sample.total) : "по курсу ЦБ"}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
