"use client";

import { Crown, Sparkles, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { toast } from "sonner";

const planDetails = {
  monthly: {
    icon: Sparkles,
    label: "Monthly Plan",
    color: "text-primary",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
  },
  yearly: {
    icon: Crown,
    label: "Yearly Plan",
    color: "text-primary",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY,
  },
  trialing: {
    icon: Zap,
    label: "Free Trial",
    color: "text-green-500",
  },
};

export default function SubscriptionInfo() {
  const { profile, loading } = useProfile();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const handleCancelSubscription = async () => {
    setCanceling(true);

    try {
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        if (data.refunded) {
          toast.success("Subscription canceled and refunded!");
        } else {
          toast.success("Subscription will be canceled at period end");
        }
        setShowCancelModal(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to cancel subscription");
      setCanceling(false);
    }
  };

  const subscribedAt = profile?.subscribed_at
    ? new Date(profile.subscribed_at)
    : null;
  const daysSinceSubscribed = subscribedAt
    ? Math.floor((Date.now() - subscribedAt.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isWithinMoneyBackPeriod =
    daysSinceSubscribed !== null && daysSinceSubscribed <= 30;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="h-5 w-5 rounded bg-gray-300" />
            <div className="h-5 w-24 rounded bg-gray-300" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 rounded bg-gray-200" />
        </CardContent>
      </Card>
    );
  }

  const isActive = profile?.subscription_status === "active";
  const isTrialing = profile?.subscription_status === "trialing";
  const hasSubscription = isActive || isTrialing;

  // Check if subscription is canceled but still active
  const isCanceledAtPeriodEnd = profile?.cancel_at && isActive;
  const cancelDate = profile?.cancel_at
    ? new Date(profile.cancel_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  let currentPlanKey: "monthly" | "yearly" | "trialing" | null = null;

  if (isTrialing) {
    currentPlanKey = "trialing";
  } else if (isActive && profile?.subscription_plan) {
    if (
      profile.subscription_plan ===
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY
    ) {
      currentPlanKey = "monthly";
    } else if (
      profile.subscription_plan ===
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY
    ) {
      currentPlanKey = "yearly";
    }
  }

  const plan = currentPlanKey ? planDetails[currentPlanKey] : null;
  const Icon = plan?.icon ?? Zap;

  const renewalDate = profile?.trial_ends_at
    ? new Date(profile.trial_ends_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Icon
              className={cn("h-5 w-5", plan?.color ?? "text-muted-foreground")}
            />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasSubscription ? (
            <div className="space-y-3">
              {/* Cancellation Warning */}
              {isCanceledAtPeriodEnd && cancelDate && (
                <div className="mb-3 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900/50 dark:bg-orange-950/50">
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    ⚠️ Your subscription will end on{" "}
                    <strong>{cancelDate}</strong>. You'll have full access until
                    then.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Plan</span>
                <span className="text-foreground text-sm font-semibold">
                  {plan?.label ?? "Active"}
                </span>
              </div>

              {isTrialing && renewalDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Trial Ends
                  </span>
                  <span className="text-foreground text-sm">{renewalDate}</span>
                </div>
              )}

              {isActive && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Status</span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isCanceledAtPeriodEnd
                        ? "text-orange-600"
                        : "text-green-600",
                    )}
                  >
                    {isCanceledAtPeriodEnd ? "Canceling" : "Active"}
                  </span>
                </div>
              )}

              {isCanceledAtPeriodEnd && cancelDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Access Until
                  </span>
                  <span className="text-foreground text-sm font-semibold">
                    {cancelDate}
                  </span>
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2">
                <Link href="/#subscribe">
                  <Button variant="outline" className="w-full text-sm">
                    Change Plan
                  </Button>
                </Link>

                {/* Only show cancel button if not already canceling */}
                {isActive && !isCanceledAtPeriodEnd && (
                  <Button
                    variant="destructive"
                    className="w-full text-sm"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                You don't have an active subscription yet.
              </p>
              <Link href="/#subscribe">
                <Button variant="main" className="w-full text-sm">
                  View Plans
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent
          className={cn(
            "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900",
          )}
        >
          <DialogHeader className={cn("text-center sm:text-center")}>
            <div className="bg-primary/10 ring-primary/20 mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ring-1">
              <Sparkles className="text-primary h-7 w-7" />
            </div>
            <DialogTitle className={cn("text-xl font-bold")}>
              Cancel Subscription?
            </DialogTitle>
            <DialogDescription className={cn("text-muted-foreground mt-2")}>
              {isWithinMoneyBackPeriod ? (
                <>
                  You're within the 30-day money-back guarantee period. Your
                  subscription will be <strong>canceled immediately</strong> and
                  you'll receive a <strong>full refund</strong>.
                </>
              ) : (
                <>
                  Are you sure you want to cancel your subscription? You'll lose
                  access to premium features at the end of your current billing
                  period. No refund will be issued.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter
            className={cn("mt-2 flex flex-col gap-2 sm:flex-col sm:gap-2")}
          >
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              disabled={canceling}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={canceling}
            >
              {canceling ? "Canceling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
