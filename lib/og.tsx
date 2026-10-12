import { readFile } from "node:fs/promises";
import path from "node:path";

// Шрифты для next/og (satori понимает woff, не woff2). Кириллица и латиница у fontsource —
// отдельные файлы, а satori склеивает одинаковые имена, поэтому латиница идёт как «<имя> Latin»
// и подключается через fallback в fontFamily (см. OG_FONT).
const FONT_DIR = path.join(process.cwd(), "node_modules", "@fontsource");

const FONTS = [
  { name: "Unbounded", file: "unbounded/files/unbounded-{s}-600-normal.woff", weight: 600 },
  { name: "Manrope", file: "manrope/files/manrope-{s}-500-normal.woff", weight: 500 },
  { name: "Manrope", file: "manrope/files/manrope-{s}-700-normal.woff", weight: 700 },
] as const;

export async function loadOgFonts() {
  const entries = await Promise.all(
    FONTS.flatMap((f) =>
      (["latin", "cyrillic"] as const).map(async (s) => ({
        name: s === "latin" ? `${f.name} Latin` : f.name,
        weight: f.weight,
        style: "normal" as const,
        data: await readFile(path.join(FONT_DIR, f.file.replace("{s}", s))),
      })),
    ),
  );
  return entries;
}

export const OG_FONT = {
  display: 'Unbounded, "Unbounded Latin"',
  body: 'Manrope, "Manrope Latin"',
};

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  ink: "#12161d",
  paper: "#f8f5ef",
  line: "#e6dfd3",
  accent: "#d23b1e",
  soft: "#4b5361",
  mute: "#7c8493",
};

export function OgLogo({ name }: { name: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: OG_COLORS.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 64 64">
          <path d="M18 40c6 4 22 4 28-2M20 24h24M32 16v32" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <div style={{ fontFamily: OG_FONT.display, fontSize: 32, color: OG_COLORS.ink }}>{name}</div>
    </div>
  );
}
