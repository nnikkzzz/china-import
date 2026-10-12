import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/config";
import { OG_COLORS as C, OG_FONT, OG_SIZE, OgLogo, loadOgFonts } from "@/lib/og";

export const alt = "Кейс: лендинг-калькулятор импорта из Китая";
export const size = OG_SIZE;
export const contentType = "image/png";

const TAGS = ["Next.js 15", "TypeScript", "Tailwind v4", "Калькулятор", "Курс ЦБ"];

export default async function Image() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: C.ink,
          padding: "64px 72px",
          fontFamily: OG_FONT.body,
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", background: C.paper, borderRadius: 24, padding: "10px 22px 10px 10px" }}>
            <OgLogo name={BRAND.name} />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.accent, letterSpacing: 4 }}>КЕЙС</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: OG_FONT.display, fontSize: 64, lineHeight: 1.1, letterSpacing: -1.5 }}>
            Лендинг импорта из Китая,
          </div>
          <div style={{ fontFamily: OG_FONT.display, fontSize: 64, lineHeight: 1.1, letterSpacing: -1.5, color: C.accent }}>
            где цена видна до заявки
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {TAGS.map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                fontSize: 24,
                padding: "10px 20px",
                borderRadius: 999,
                border: "2px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
