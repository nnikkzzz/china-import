"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Paperclip, X } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/lead-schema";
import { useAttachedCalc } from "@/components/calc-context";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/config";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" } | { kind: "success"; demo: boolean } | { kind: "error"; message: string };

export function LeadForm() {
  const { attached, attach } = useAttachedCalc();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", contact: "", product: "", consent: false, website: "" },
  });

  const onSubmit = async (data: LeadInput) => {
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, calc: attached ?? undefined }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; demo?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Не удалось отправить заявку");
      setStatus({ kind: "success", demo: Boolean(json.demo) });
      reset();
      attach(null);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Ошибка сети" });
    }
  };

  if (status.kind === "success") {
    return (
      <div className="rounded-[28px] bg-card p-8 text-center ring-1 ring-line">
        <CheckCircle2 className="mx-auto size-12 text-jade" />
        <h3 className="mt-4 font-display text-xl font-semibold">Заявка принята</h3>
        <p className="mt-3 text-ink-soft">
          Менеджер свяжется с вами в течение рабочего дня: уточнит товар, найдёт 2–3 фабрики и пришлёт расчёт с фиксированной ценой.
        </p>
        {status.demo && (
          <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-xs text-ink-mute">
            Это концепт-проект: заявка никуда не отправлена, данные не сохранены.
          </p>
        )}
        <Button variant="ghost" className="mt-6" onClick={() => setStatus({ kind: "idle" })}>
          Отправить ещё одну
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-[28px] bg-card p-6 ring-1 ring-line sm:p-8"
    >
      {attached && (
        <div className="flex items-start gap-3 rounded-2xl bg-accent-soft p-4 text-sm">
          <Paperclip className="mt-0.5 size-4 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Расчёт из калькулятора прикреплён</p>
            <p className="mt-1 text-xs whitespace-pre-line text-ink-soft">{attached}</p>
          </div>
          <button
            type="button"
            onClick={() => attach(null)}
            aria-label="Открепить расчёт"
            className="-m-2 grid size-11 shrink-0 place-items-center rounded-full text-ink-mute hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <Input label="Имя" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input
        label="Телефон или Telegram"
        placeholder="+7 900 000-00-00 или @username"
        autoComplete="tel"
        error={errors.contact?.message}
        {...register("contact")}
      />
      <div>
        <label htmlFor="lead-product" className="mb-1.5 block text-sm font-semibold">
          Что везём <span className="font-normal text-ink-mute">— ссылка на 1688/Taobao или описание</span>
        </label>
        <textarea
          id="lead-product"
          rows={3}
          className={cn(fieldCls, "h-auto resize-y py-3", errors.product && errorRing)}
          {...register("product")}
        />
        {errors.product && <p className="mt-1 text-xs text-accent">{errors.product.message}</p>}
      </div>

      {/* honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />

      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
        <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-accent" {...register("consent")} />
        <span>
          Согласен на обработку персональных данных по{" "}
          <a href="/privacy" target="_blank" className="font-semibold text-ink underline underline-offset-2 hover:text-accent">
            политике конфиденциальности
          </a>
        </span>
      </label>
      {errors.consent && <p className="-mt-2 text-xs text-accent">{errors.consent.message}</p>}

      {status.kind === "error" && (
        <p role="alert" className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent-dark">
          {status.message}. Или напишите напрямую: {BRAND.telegram}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Отправляем…
          </>
        ) : (
          "Получить расчёт за 1 день"
        )}
      </Button>
    </form>
  );
}

const fieldCls =
  "h-12 w-full rounded-xl bg-paper/60 px-3.5 text-base text-ink ring-1 ring-line outline-none ring-inset transition placeholder:text-ink-mute focus:bg-card focus:ring-2 focus:ring-accent";
const errorRing = "ring-accent/70";

function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = `lead-${props.name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input id={id} aria-invalid={Boolean(error)} className={cn(fieldCls, error && errorRing)} {...props} />
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}
