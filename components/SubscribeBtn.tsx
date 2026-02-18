"use client";

import { Button } from "./ui/button";
import { subscribeAction } from "@/app/get-started/stripe";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import SwitchPlanModal from "./SwitchPlanModal";
import { createClient } from "@/utils/supabase/client";

type Props = {
  priceId: string;
  trialDays?: number;
  isTrial?: boolean;
  popular?: boolean;
  profile?: any;
  loading?: boolean;
};

export default function SubscribeBtn({
  priceId,
  trialDays,
  isTrial,
  popular,
  profile,
  loading = false,
}: Props) {
  const { user } = useUser();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [trialStatus, setTrialStatus] = useState<{
    hasHadTrial: boolean;
    hasHadPaidSubscription: boolean;
  }>({ hasHadTrial: false, hasHadPaidSubscription: false });
  const [checkingTrial, setCheckingTrial] = useState(true);

  const isLoggedIn = !!user;

  // Check trial history from database
  useEffect(() => {
    const checkTrialHistory = async () => {
      if (!isLoggedIn || !user?.email) {
        setCheckingTrial(false);
        return;
      }

      const supabase = createClient();

      // Check trial_history table
      const { data: trialHistory } = await supabase
        .from("trial_history")
        .select("trial_ends_at")
        .eq("email", user.email)
        .maybeSingle();

      // Check if they've ever had a paid subscription (subscribed_at exists)
      const hasHadPaidSubscription = profile?.subscribed_at !== null;

      // Check if they actually used a trial (trial_ends_at in profile or trial_history)
      const hadTrialInProfile = profile?.trial_ends_at !== null;
      const hadTrialInHistory = trialHistory !== null;
      const hasHadTrial = hadTrialInProfile || hadTrialInHistory;

      setTrialStatus({
        hasHadTrial,
        hasHadPaidSubscription,
      });
      setCheckingTrial(false);
    };

    if (!loading) {
      checkTrialHistory();
    }
  }, [
    isLoggedIn,
    user?.email,
    profile?.trial_ends_at,
    profile?.subscribed_at,
    loading,
  ]);

  const trialEndsAt = profile?.trial_ends_at
    ? new Date(profile.trial_ends_at)
    : null;

  const isTrialing =
    isLoggedIn &&
    !loading &&
    profile?.subscription_status === "trialing" &&
    trialEndsAt &&
    trialEndsAt.getTime() > Date.now();

  const isActive =
    isLoggedIn && !loading && profile?.subscription_status === "active";

  const isCurrentPlan = isActive && profile?.subscription_plan === priceId;

  const daysLeft =
    isTrialing && profile?.trial_ends_at
      ? Math.max(
          0,
          Math.ceil(
            (new Date(profile.trial_ends_at).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : null;

  const handleSubscribe = async () => {
    if (submitting) return;

    if (!isLoggedIn) {
      router.push("/get-started");
      return;
    }

    // Show confirmation for plan switches
    if (isActive && !isCurrentPlan && !isTrial) {
      setShowConfirmModal(true);
      return;
    }

    await proceedWithSubscription();
  };

  const proceedWithSubscription = async () => {
    setSubmitting(true);
    setShowConfirmModal(false);

    const res = await subscribeAction({
      priceId,
      trialDays:
        isTrial &&
        !trialStatus.hasHadTrial &&
        !trialStatus.hasHadPaidSubscription
          ? trialDays
          : undefined,
    });

    if (!res.url && !res.error) {
      setTimeout(() => window.location.reload(), 1000);
      return;
    }

    if (res.url) {
      window.location.href = res.url;
      return;
    }

    setSubmitting(false);
  };

  let label = "Subscribe";
  let disabled = submitting || checkingTrial;

  if (!loading && !checkingTrial) {
    // Not logged in
    if (!isLoggedIn) {
      label = isTrial ? "Start Free Trial" : "Subscribe";
      disabled = false;
    }
    // Trial button
    else if (isTrial) {
      if (isTrialing) {
        label = `Free Trial · ${daysLeft} days left`;
        disabled = true;
      } else if (trialStatus.hasHadPaidSubscription) {
        // User had a paid subscription (regardless of trial usage)
        label = "Trial Unavailable";
        disabled = true;
      } else if (trialStatus.hasHadTrial) {
        // User used trial but never paid
        label = "Trial Used";
        disabled = true;
      } else if (isActive) {
        // User has active subscription
        label = "Trial Unavailable";
        disabled = true;
      } else {
        label = "Start Free Trial";
        disabled = false;
      }
    }
    // Current paid plan
    else if (isCurrentPlan) {
      label = "Current Plan";
      disabled = true;
    }
    // User is on trial, show upgrade on paid plans
    else if (isTrialing) {
      label = "Upgrade Now";
      disabled = false;
    }
    // User has active paid subscription
    else if (isActive) {
      label = "Switch Plan";
      disabled = false;
    }
  }

  return (
    <>
      <Button
        variant={popular ? "main" : "secondary"}
        className={cn("w-full")}
        disabled={disabled}
        onClick={handleSubscribe}
      >
        {submitting ? "Redirecting..." : label}
      </Button>

      <SwitchPlanModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        proceedWithSubscription={proceedWithSubscription}
        submitting={submitting}
      />
    </>
  );
}
