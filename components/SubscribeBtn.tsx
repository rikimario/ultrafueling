"use client";

import { Button } from "./ui/button";
import { subscribeAction } from "@/app/get-started/stripe";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

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

  const isLoggedIn = !!user;

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

  // Check if this specific plan is the current plan
  const isCurrentPlan = isActive && profile?.subscription_plan === priceId;

  const hasHadTrial = isLoggedIn && !loading && profile?.trial_ends_at !== null;

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
    // If switching plans, show confirmation
    if (isActive && !isCurrentPlan && !isTrial) {
      const confirmed = window.confirm(
        `Switch to ${isTrial ? "Free Trial" : "this plan"}? You'll be charged the prorated difference.`,
      );
      if (!confirmed) return;
    }

    if (submitting) return;

    if (!isLoggedIn) {
      router.push("/get-started");
      return;
    }

    setSubmitting(true);

    const res = await subscribeAction({
      priceId,
      trialDays: isTrial && !hasHadTrial ? trialDays : undefined,
    });

    // If switching plans (no URL returned), reload the page
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
  let disabled = submitting;

  if (!loading) {
    // Not logged in
    if (!isLoggedIn) {
      label = isTrial ? "Start Free Trial" : "Subscribe";
      disabled = false;
    }
    // Trial button (handle separately to avoid confusion with paid plans)
    else if (isTrial) {
      if (isTrialing) {
        label = `Free Trial · ${daysLeft} days left`;
        disabled = true;
      } else if (hasHadTrial) {
        // Trial was used (don't check isCurrentPlan for trial button)
        label = "Trial Used";
        disabled = true;
      } else if (isCurrentPlan && !hasHadTrial) {
        label = "Trial Unavailable";
        disabled = true;
      } else {
        label = "Start Free Trial";
        disabled = false;
      }
    }
    // Current paid plan (only for non-trial buttons)
    else if (isCurrentPlan) {
      label = "Current Plan";
      disabled = true;
    }
    // User is on trial, show upgrade on paid plans
    else if (isTrialing) {
      label = "Upgrade Now";
      disabled = false;
    }
    // User has active paid subscription, show upgrade/downgrade on other plans
    else if (isActive) {
      label = "Switch Plan";
      disabled = false;
    }
  }

  return (
    <Button
      variant={popular ? "main" : "secondary"}
      className={cn("w-full")}
      disabled={disabled}
      onClick={handleSubscribe}
    >
      {submitting ? "Redirecting..." : label}
    </Button>
  );
}
