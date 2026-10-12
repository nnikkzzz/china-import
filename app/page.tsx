import { CalcProvider } from "@/components/calc-context";
import { DemoBanner, Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Compare } from "@/components/sections/Compare";
import { Steps } from "@/components/sections/Steps";
import { Examples } from "@/components/sections/Examples";
import { Pricing } from "@/components/sections/Pricing";
import { Faq, FAQ_ITEMS } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { getRates } from "@/lib/rates";

export const revalidate = 21600; // курс ЦБ обновляется раз в 6 часов

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default async function Home() {
  const rates = await getRates();
  return (
    <CalcProvider>
      <DemoBanner />
      <Header />
      <main>
        <Hero rates={rates} />
        <Compare />
        <Steps />
        <Examples rates={rates} />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </CalcProvider>
  );
}
