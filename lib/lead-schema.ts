import { z } from "zod";

const CONTACT_RE = /^(\+?[\d\s()-]{10,20}|@[A-Za-z0-9_]{5,32})$/;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Как к вам обращаться?").max(60, "Слишком длинное имя"),
  contact: z
    .string()
    .trim()
    .refine((v) => CONTACT_RE.test(v), "Телефон или @username в Telegram"),
  product: z.string().trim().max(500, "До 500 символов").optional(),
  calc: z.string().max(1500).optional(),
  consent: z.boolean().refine((v) => v === true, "Нужно согласие на обработку данных"),
  website: z.string().optional(), // honeypot: люди это поле не видят
});

export type LeadInput = z.input<typeof leadSchema>;
