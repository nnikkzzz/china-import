"use client";

import { createContext, useContext, useState } from "react";

type CalcContextValue = {
  attached: string | null;
  attach: (summary: string | null) => void;
};

const CalcContext = createContext<CalcContextValue | null>(null);

// Передаёт расчёт из калькулятора в форму заявки внизу страницы.
export function CalcProvider({ children }: { children: React.ReactNode }) {
  const [attached, attach] = useState<string | null>(null);
  return <CalcContext.Provider value={{ attached, attach }}>{children}</CalcContext.Provider>;
}

export function useAttachedCalc() {
  const ctx = useContext(CalcContext);
  if (!ctx) throw new Error("useAttachedCalc must be used inside <CalcProvider>");
  return ctx;
}
