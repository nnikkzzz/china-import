import { Check, X } from "lucide-react";
import { Section } from "@/components/ui/section";

const ROWS: Array<[string, string, string]> = [
  ["Цена за кг на первый взгляд", "Ниже", "Выше на 20–40%"],
  ["Документы для маркетплейсов", "Нет: товар не пройдёт проверку", "ДТ, договор, сертификат"],
  ["НДС к вычету", "Нет", "Да, возвращается вычетом"],
  ["Груз застрахован", "Обычно нет", "На 100% стоимости"],
  ["Если груз задержали или изъяли", "Потеря всей партии", "Отвечаем по договору"],
  ["Товар можно учесть в бухгалтерии", "Нет", "Да, с первичкой"],
];

export function Compare() {
  return (
    <Section
      id="compare"
      eyebrow="Карго или белый импорт"
      title="Дешёвое карго обходится дороже, когда товар нужно продать"
      intro="Без таможенной декларации Wildberries и Ozon не примут партию, банк задаст вопросы, а НДС ляжет в себестоимость. Белая схема дороже на старте, но в итоге выходит дешевле."
    >
      <div className="overflow-hidden rounded-[28px] bg-card ring-1 ring-line">
        <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-line bg-paper/60 text-xs font-bold tracking-wider uppercase sm:text-sm sm:normal-case sm:tracking-normal">
          <div className="p-4 sm:p-5" />
          <div className="p-4 text-ink-mute sm:p-5">«Серое» карго</div>
          <div className="p-4 text-accent sm:p-5">Синопуть</div>
        </div>
        {ROWS.map(([label, cargo, white]) => (
          <div
            key={label}
            className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-line text-sm last:border-0 sm:text-[15px]"
          >
            <div className="p-4 font-semibold sm:p-5">{label}</div>
            <div className="flex gap-2 p-4 text-ink-soft sm:p-5">
              <X className="mt-0.5 hidden size-4 shrink-0 text-ink-mute sm:block" />
              {cargo}
            </div>
            <div className="flex gap-2 bg-jade-soft/40 p-4 sm:p-5">
              <Check className="mt-0.5 hidden size-4 shrink-0 text-jade sm:block" />
              {white}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
