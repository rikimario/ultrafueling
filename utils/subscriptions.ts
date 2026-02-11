import { createClient } from "@/utils/supabase/server";

/**
 * Check if user has active subscription OR active trial
 * @returns true if user can access premium features
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, trial_ends_at")
    .eq("id", userId)
    .single();

  if (!profile) return false;

  // User has active paid subscription
  if (profile.subscription_status === "active") {
    return true;
  }

  // User is in trial period and trial hasn't ended yet
  if (profile.subscription_status === "trialing" && profile.trial_ends_at) {
    const trialEndDate = new Date(profile.trial_ends_at);
    const now = new Date();
    return trialEndDate > now;
  }

  return false;
}

/**
 * Get subscription details for display
 */
export async function getSubscriptionDetails(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_plan, trial_ends_at")
    .eq("id", userId)
    .single();

  if (!profile) {
    return {
      hasAccess: false,
      status: null,
      isTrialing: false,
      daysLeftInTrial: null,
    };
  }

  const isTrialing = profile.subscription_status === "trialing";
  const hasAccess = await hasActiveSubscription(userId);

  let daysLeftInTrial = null;
  if (isTrialing && profile.trial_ends_at) {
    const trialEndDate = new Date(profile.trial_ends_at);
    const now = new Date();
    daysLeftInTrial = Math.max(
      0,
      Math.ceil(
        (trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
  }

  return {
    hasAccess,
    status: profile.subscription_status,
    isTrialing,
    daysLeftInTrial,
    plan: profile.subscription_plan,
  };
}
