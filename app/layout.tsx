import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { BRAND, DEMO_MODE, SITE_URL } from "@/lib/config";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" });
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-unbounded",
  display: "swap",
});

const title = "Товары из Китая под ключ — с белой растаможкой и ценой в договоре";
const description =
  "Поиск фабрики, проверка качества, доставка и растаможка с НДС и документами для Wildberries и Ozon. Онлайн-калькулятор итоговой стоимости по курсу ЦБ.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND.name} — ${title}`, template: `%s · ${BRAND.name}` },
  description,
  keywords: ["товары из Китая", "доставка из Китая", "белая растаможка", "импорт из Китая", "карго", "ВЭД"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: BRAND.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: !DEMO_MODE, follow: !DEMO_MODE },
};

export const viewport: Viewport = {
  themeColor: "#f8f5ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
