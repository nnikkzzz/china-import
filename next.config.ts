import type { NextConfig } from "next";

// OG-картинки читают woff-шрифты с диска при ревалидации — явно включаем их в бандл функций.
const OG_FONTS = ["./node_modules/@fontsource/unbounded/files/*-600-normal.woff", "./node_modules/@fontsource/manrope/files/*-{500,700}-normal.woff"];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/opengraph-image": OG_FONTS,
    "/twitter-image": OG_FONTS,
    "/case/opengraph-image": OG_FONTS,
    "/case/twitter-image": OG_FONTS,
  },
};

export default nextConfig;
