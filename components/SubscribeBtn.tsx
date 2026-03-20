"use client";

import { Button } from "./ui/button";
import { subscribeAction } from "@/app/get-started/stripe";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import SwitchPlanModal from "./SwitchPlanModal";
import { Profile } from "@/types/user";
import { useProfile } from "@/hooks/useProfile";

type Props = {
  priceId: string;
  trialDays?: number;
  isTrial?: boolean;
  popular?: boolean;
  profile?: Profile;
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
  const { hasHadTrial, hasHadPaidSubscription } = useProfile();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
        isTrial && !hasHadTrial && !hasHadPaidSubscription
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
  let disabled = submitting || loading;

  if (!loading) {
    // ✅ Handle not logged in first
    if (!isLoggedIn) {
      label = isTrial ? "Start Free Trial" : "Subscribe";
      disabled = false;
    }
    // ✅ Handle trial button for logged in users
    else if (isTrial) {
      if (isTrialing) {
        label = `Free Trial · ${daysLeft} days left`;
        disabled = true;
      } else if (hasHadPaidSubscription) {
        label = "Trial Unavailable";
        disabled = true;
      } else if (hasHadTrial) {
        label = "Trial Used";
        disabled = true;
      } else if (isActive) {
        label = "Trial Unavailable";
        disabled = true;
      } else {
        // ✅ New user, eligible for trial
        label = "Start Free Trial";
        disabled = false;
      }
    }
    // ✅ Handle paid plans
    else if (isCurrentPlan) {
      label = "Current Plan";
      disabled = true;
    } else if (isTrialing) {
      label = "Upgrade Now";
      disabled = false;
    } else if (isActive) {
      label = "Switch Plan";
      disabled = false;
    }
  }

  return (
    <>
      <Button
        variant={popular ? "main" : "secondary"}
        className={cn(
          "w-full border-1",
          popular ? "" : "border-1 border-[#66b3ff]/95",
        )}
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
