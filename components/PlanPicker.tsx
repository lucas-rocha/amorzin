// components/PlanPicker.tsx
"use client";

import { PLAN_LIMITS, PlanType } from "@/lib/plans";

export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface PlanPickerProps {
  eligiblePlans: PlanType[];
  recommended: PlanType;
  selected: PlanType;
  onSelect: (plan: PlanType) => void;
}

export function PlanPicker({ eligiblePlans, recommended, selected, onSelect }: PlanPickerProps) {
  const allPlans: PlanType[] = ["BASICO", "SUPER", "PREMIUM"];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {allPlans.map((key) => {
        const plan = PLAN_LIMITS[key];
        const disabled = !eligiblePlans.includes(key);
        const isSelected = selected === key;

        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(key)}
            className={`relative rounded-2xl border p-4 text-left transition ${
              isSelected ? "border-[#E6395B] bg-[#FFF5F7]" : "border-[#E8DADD] bg-white"
            } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
          >
            {key === recommended && !disabled && (
              <span className="absolute -top-2 left-3 rounded-full bg-[#E6395B] px-2 py-0.5 text-[9px] font-bold text-white">
                RECOMENDADO
              </span>
            )}
            <div className="text-xs font-bold text-[#35131F]">{plan.label}</div>
            <div className="mt-1 text-lg font-bold text-[#35131F]">{formatPrice(plan.priceCents)}</div>
            <div className="mt-2 text-[10px] leading-5 text-[#8F747C]">
              {plan.maxPhotos} fotos ·{" "}
              {plan.expiresInDays === null ? "link sem expirar" : `link ${plan.expiresInDays === 1 ? "24h" : `${plan.expiresInDays} dias`}`}
              {plan.watermark && " · marca d'água"}
              {plan.requiresAccount && " · requer conta"}
              {plan.multiGame && " · gerencia vários jogos"}
            </div>
            {disabled && <div className="mt-2 text-[9px] font-semibold text-[#E6395B]">fotos demais pra esse plano</div>}
          </button>
        );
      })}
    </div>
  );
}