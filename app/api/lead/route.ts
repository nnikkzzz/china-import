import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { DEMO_MODE } from "@/lib/config";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return false;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (isLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Слишком много заявок. Попробуйте через 10 минут." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Проверьте поля формы" }, { status: 422 });
  }
  const { website, name, contact, product, calc } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // бот заполнил honeypot — молча игнорируем

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (DEMO_MODE) {
    console.info("[lead] demo mode: заявка принята, но никуда не отправлена");
    return NextResponse.json({ ok: true, demo: true });
  }
  if (!token || !chatId) {
    // В боевом режиме без Telegram нельзя отвечать «успех» — заявка потерялась бы молча.
    console.error("[lead] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы при NEXT_PUBLIC_DEMO_MODE=false");
    return NextResponse.json({ ok: false, error: "Приём заявок временно недоступен" }, { status: 503 });
  }

  const text = [
    "<b>Новая заявка · импорт из Китая</b>",
    `Имя: ${esc(name)}`,
    `Контакт: ${esc(contact)}`,
    product ? `Товар: ${esc(product)}` : null,
    calc ? `\n<b>Расчёт с сайта</b>\n<pre>${esc(calc)}</pre>` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!tg.ok) throw new Error(`telegram ${tg.status}`);
  } catch (err) {
    console.error("[lead] delivery failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "Не удалось отправить. Напишите нам в Telegram." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
