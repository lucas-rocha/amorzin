export interface PlanLimits {
  label: string;
  maxPhotos: number;
  maxHitMessages: number;
  maxMissMessages: number;
  allowCustomFinalMessage: boolean;
  watermark: boolean;
  expiresInDays: number | null; // null = nunca expira
  priceCents: number;
  requiresAccount: boolean; // novo
  multiGame: boolean;       // novo
}

export type PlanType = "BASICO" | "SUPER" | "PREMIUM";

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  BASICO: {
    label: "Básico",
    maxPhotos: 4,
    maxHitMessages: 3,
    maxMissMessages: 3,
    allowCustomFinalMessage: true,
    watermark: true,
    expiresInDays: 1, // 24 horas
    priceCents: 1990, // R$19,90
    requiresAccount: false,
    multiGame: false
  },
  SUPER: {
    label: "Super",
    maxPhotos: 10,
    maxHitMessages: 8,
    maxMissMessages: 8,
    allowCustomFinalMessage: true,
    watermark: false,
    expiresInDays: 365, // 1 ano
    priceCents: 2990, // R$29,90
    requiresAccount: false, 
    multiGame: false
  },
  PREMIUM: {
    label: "Premium",
    maxPhotos: 10,
    maxHitMessages: 999,
    maxMissMessages: 999,
    allowCustomFinalMessage: true,
    watermark: false,
    expiresInDays: null, // sem expiração
    priceCents: 6990, // R$69,90
    requiresAccount: true,
    multiGame: true
  }
};

export function getPlanLimits(plan: PlanType): PlanLimits {
  return PLAN_LIMITS[plan];
}

// Básico e Super continuam sendo escolhidos por jogo, na tela de planos.
// Premium não é mais "por jogo" — vira o preço da conta (ver checkout/premium-account).
export function getEligiblePlans(photoCount: number): PlanType[] {
  return (["BASICO", "SUPER", "PREMIUM"] as PlanType[]).filter(
    (key) => photoCount <= PLAN_LIMITS[key].maxPhotos
  );
}

export function getRecommendedPlan(photoCount: number): PlanType {
  const eligible = getEligiblePlans(photoCount);
  if (eligible.length === 0) return "SUPER"; // teto de fotos do Super vira o limite geral pra quem não é premium
  return eligible.reduce((cheapest, key) =>
    PLAN_LIMITS[key].priceCents < PLAN_LIMITS[cheapest].priceCents ? key : cheapest
  );
}