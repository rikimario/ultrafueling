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
  const [cancelType, setCancelType] = useState<"period_end" | "immediate">(
    "immediate",
  ); // Default to immediate for yearly

  const isYearlyPlan =
    profile?.subscription_plan ===
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY;

  const handleCancelSubscription = async () => {
    setCanceling(true);

    try {
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancelType:
            isYearlyPlan && !isWithinMoneyBackPeriod ? cancelType : undefined,
        }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        setCanceling(false);
      } else {
        setShowCancelModal(false);

        if (data.refunded) {
          if (data.partialRefund && data.refundAmount) {
            // Yearly plan with pro-rated refund
            toast.success(
              `Subscription canceled! You'll receive a refund of €${data.refundAmount.toFixed(2)}`,
            );
          } else {
            // Full refund (30-day money-back)
            toast.success("Subscription canceled and fully refunded!");
          }
        } else {
          // Monthly plan - cancel at period end
          toast.success("Subscription will be canceled at period end");
        }

        // Reload after showing toast
        setTimeout(() => window.location.reload(), 1500);
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
        <CardContent className={cn("p-4")}>
          {hasSubscription ? (
            <div className="space-y-3">
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
            <div className="space-y-4">
              <div className="border-muted-foreground/30 from-muted/30 to-muted/10 rounded-lg border border-dashed bg-gradient-to-br p-6 text-center">
                <Sparkles className="text-primary/60 mx-auto mb-3 h-8 w-8" />
                <p className="text-foreground mb-1 text-sm font-medium">
                  Ready to get started?
                </p>
                <p className="text-muted-foreground text-xs">
                  Choose a plan and unlock premium features
                </p>
              </div>
              <Link href="/#subscribe">
                <Button variant="main" className="w-full text-sm">
                  Explore Plans
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
            <DialogDescription
              className={cn("text-muted-foreground mt-2 text-left")}
            >
              {isWithinMoneyBackPeriod ? (
                <span className="text-center">
                  You're within the 30-day money-back guarantee period. Your
                  subscription will be <strong>canceled immediately</strong> and
                  you'll receive a <strong>full refund</strong>.
                </span>
              ) : isYearlyPlan ? (
                <>
                  <strong className="mb-3 block text-center">
                    Choose how you'd like to cancel:
                  </strong>
                  <span className="space-y-3">
                    <label className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors">
                      <input
                        type="radio"
                        name="cancelType"
                        value="immediate"
                        checked={cancelType === "immediate"}
                        onChange={(e) =>
                          setCancelType(e.target.value as "immediate")
                        }
                        className="mt-1"
                      />
                      <span className="flex flex-col text-left">
                        <span className="text-foreground text-sm font-medium">
                          Cancel now with partial refund
                        </span>
                        <span className="mt-1 text-xs">
                          Get a pro-rated refund for unused months
                        </span>
                      </span>
                    </label>
                    <label className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors">
                      <input
                        type="radio"
                        name="cancelType"
                        value="period_end"
                        checked={cancelType === "period_end"}
                        onChange={(e) =>
                          setCancelType(e.target.value as "period_end")
                        }
                        className="mt-1"
                      />
                      <span className="flex flex-col text-left">
                        <span className="text-foreground text-sm font-medium">
                          Keep access until {cancelDate}
                        </span>
                        <span className="mt-1 text-xs">
                          Continue using premium features for the remainder of
                          your paid period
                        </span>
                      </span>
                    </label>
                  </span>
                </>
              ) : (
                <div className="text-center">
                  Are you sure you want to cancel your subscription? You'll lose
                  access to premium features at the end of your current billing
                  period. No refund will be issued.
                </div>
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
