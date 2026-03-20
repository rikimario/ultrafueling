"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useProfile() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setProfile(null);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select(
        "subscription_status, subscription_plan, trial_ends_at, cancel_at, subscribed_at, stripe_subscription_id",
      )
      .eq("id", user.id)
      .single();

    const { data: trialHistory } = await supabase
      .from("trial_history")
      .select("trial_ends_at, email, user_id")
      .eq("email", user.email!)
      .maybeSingle();

    const hadTrialInProfile =
      profile &&
      profile?.trial_ends_at !== null &&
      profile?.trial_ends_at !== undefined &&
      profile?.trial_ends_at !== "null";
    const hadTrialInHistory = trialHistory !== null;
    const hasHadTrial = hadTrialInProfile || hadTrialInHistory;

    setProfile({
      ...data,
      trialHistory: trialHistory || null,
      // trial_ends_at: data?.trial_ends_at || trialHistory?.trial_ends_at,
      hasHadTrial,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();

    // ✅ Listen for auth changes and reload profile
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        loadProfile();
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasPremiumAccess = useMemo(() => {
    if (!profile) return false;

    const status = profile.subscription_status;

    // ✅ Active subscription - always has access
    if (status === "active") return true;

    // ✅ Trialing - check if trial hasn't expired
    if (status === "trialing") {
      if (!profile.trial_ends_at) return false;

      const trialEndsAt = new Date(profile.trial_ends_at);
      const now = new Date();

      // Only grant access if trial hasn't expired
      return trialEndsAt > now;
    }

    // ✅ All other statuses (canceled, past_due, etc.) - no access
    return false;
  }, [profile]);

  // ✅ Check if user has ever had a trial
  const hasHadTrial = useMemo(() => {
    if (!profile) return false;

    // Check trial_history table
    const hadTrialInHistory = profile.trialHistory !== null;

    // Check if profile has/had trial_ends_at
    const hadTrialInProfile =
      profile.trial_ends_at !== null &&
      profile.trial_ends_at !== undefined &&
      profile.trial_ends_at !== "null";

    return hadTrialInHistory || hadTrialInProfile;
  }, [profile]);

  // ✅ Check if user has ever had a paid subscription
  const hasHadPaidSubscription = useMemo(() => {
    if (!profile) return false;

    return (
      profile.subscribed_at !== null &&
      profile.subscribed_at !== undefined &&
      profile.subscribed_at !== "null"
    );
  }, [profile]);

  return {
    profile,
    loading,
    hasPremiumAccess,
    hasHadTrial,
    hasHadPaidSubscription,
  };
}
