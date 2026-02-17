"use client";

import { useEffect, useState } from "react";
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
        "subscription_status, subscription_plan, trial_ends_at, cancel_at, subscribed_at",
      )
      .eq("id", user.id)
      .single();

    const { data: trialHistory } = await supabase
      .from("trial_history")
      .select("trial_ends_at")
      .eq("email", user.email!)
      .maybeSingle();

    setProfile({
      ...data,
      trial_ends_at: data?.trial_ends_at || trialHistory?.trial_ends_at,
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

  const hasPremiumAccess =
    profile?.subscription_status === "active" ||
    profile?.subscription_status === "trialing";

  return { profile, loading, hasPremiumAccess };
}
