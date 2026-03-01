export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "trialing"
  | "past_due"
  | "pending";

export type PlanKey = "monthly" | "yearly" | "trialing";

export type CancelType = "period_end" | "immediate";

export interface PlanDetail {
  icon: any; // LucideIcon type
  label: string;
  color: string;
  priceId?: string;
}

export interface Profile {
  subscription_status: SubscriptionStatus;
  subscription_plan: string | null;
  subscribed_at: string | null;
  trial_ends_at: string | null;
  cancel_at: string | null;
}

export interface CancelSubscriptionResponse {
  error?: string;
  success?: boolean;
  refunded?: boolean;
  partialRefund?: boolean;
  refundAmount?: number;
  message?: string;
}
