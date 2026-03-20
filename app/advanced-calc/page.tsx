import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdvancedCalcForm from "@/components/AdvancedCalcForm";

export default async function AdvancedCalcPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/get-started");
  }

  // ✅ Fetch profile with trial_ends_at
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, trial_ends_at")
    .eq("id", user.id)
    .single();

  let hasPremiumAccess = false;

  // ✅ Check active subscription
  if (profile?.subscription_status === "active") {
    hasPremiumAccess = true;
  }
  // ✅ Check trialing - but verify trial hasn't expired
  else if (profile?.subscription_status === "trialing") {
    if (profile.trial_ends_at) {
      const trialEndsAt = new Date(profile.trial_ends_at);
      const now = new Date();

      // Only grant access if trial hasn't expired
      hasPremiumAccess = trialEndsAt > now;
    }
  }

  // ✅ Redirect if no premium access
  if (!hasPremiumAccess) {
    redirect("/#subscribe");
  }

  return <AdvancedCalcForm user={user} />;
}
