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
    priceCents: 2400, // R$24
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
    priceCents: 3900, // ajuste como quiser
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
    priceCents: 7900, // ajuste como quiser
    requiresAccount: true,
    multiGame: true
  }
};

export function getPlanLimits(plan: PlanType): PlanLimits {
  return PLAN_LIMITS[plan];
}

// Quais planos ainda cobrem essa quantidade de fotos
export function getEligiblePlans(photoCount: number): PlanType[] {
  return (Object.keys(PLAN_LIMITS) as PlanType[]).filter(
    (key) => photoCount <= PLAN_LIMITS[key].maxPhotos
  );
}

// Sugestão em tempo real (o mais barato entre os elegíveis)
export function getRecommendedPlan(photoCount: number): PlanType {
  const eligible = getEligiblePlans(photoCount);
  if (eligible.length === 0) return "PREMIUM"; // >10 fotos: só cabe ajustando o teto de fotos
  return eligible.reduce((cheapest, key) =>
    PLAN_LIMITS[key].priceCents < PLAN_LIMITS[cheapest].priceCents ? key : cheapest
  );
}