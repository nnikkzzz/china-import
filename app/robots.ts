import type { MetadataRoute } from "next";
import { DEMO_MODE, SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  // Концепт с вымышленной компанией не должен попадать в поиск.
  if (DEMO_MODE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
