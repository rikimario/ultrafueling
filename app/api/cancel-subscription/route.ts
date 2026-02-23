import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get cancelType from request body
  const body = await req.json().catch(() => ({}));
  const requestedCancelType = body.cancelType; // "immediate" or "period_end"

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "stripe_subscription_id, subscription_status, subscribed_at, stripe_customer_id, subscription_plan",
      )
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_subscription_id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    if (profile.subscription_status !== "active") {
      return NextResponse.json(
        { error: "Subscription is not active" },
        { status: 400 },
      );
    }

    const subscribedAt = new Date(profile.subscribed_at);
    const daysSinceSubscribed = Math.floor(
      (Date.now() - subscribedAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    const isWithinMoneyBackPeriod = daysSinceSubscribed <= 30;
    const isYearlyPlan =
      profile.subscription_plan ===
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY;

    if (isWithinMoneyBackPeriod) {
      // IMMEDIATE CANCELLATION WITH FULL REFUND (30-day money-back guarantee)

      const charges = await stripe.charges.list({
        customer: profile.stripe_customer_id,
        limit: 5,
      });

      if (charges.data.length > 0) {
        const latestCharge = charges.data[0];

        if (latestCharge.paid && !latestCharge.refunded) {
          await stripe.refunds.create({
            charge: latestCharge.id,
            reason: "requested_by_customer",
          });
        }
      }

      await stripe.subscriptions.cancel(profile.stripe_subscription_id);

      if (user.email) {
        await supabaseAdmin.from("trial_history").upsert(
          {
            email: user.email,
            user_id: user.id,
            trial_ends_at: new Date().toISOString(),
          },
          {
            onConflict: "email",
          },
        );
      }

      return NextResponse.json({
        success: true,
        refunded: true,
        message: "Subscription canceled and refunded successfully",
      });
    } else if (isYearlyPlan && requestedCancelType === "immediate") {
      // YEARLY PLAN: IMMEDIATE CANCELLATION WITH PRO-RATED REFUND

      // Calculate refund based on DATABASE subscribed_at, not Stripe dates
      const subscribedAt = new Date(profile.subscribed_at);
      const now = Date.now();
      const oneYear = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

      const timeUsed = now - subscribedAt.getTime();
      const timeRemaining = oneYear - timeUsed;

      const refundPercentage = Math.max(0, timeRemaining / oneYear);

      const charges = await stripe.charges.list({
        customer: profile.stripe_customer_id,
        limit: 5,
      });

      let refundAmount = 0;

      if (charges.data.length > 0) {
        const latestCharge = charges.data[0];
        const refundAmountCents = Math.floor(
          latestCharge.amount * refundPercentage,
        );

        if (
          latestCharge.paid &&
          !latestCharge.refunded &&
          refundAmountCents > 0
        ) {
          await stripe.refunds.create({
            charge: latestCharge.id,
            amount: refundAmountCents,
            reason: "requested_by_customer",
          });

          refundAmount = refundAmountCents / 100;
        }
      }

      await stripe.subscriptions.cancel(profile.stripe_subscription_id);

      if (user.email) {
        await supabaseAdmin.from("trial_history").upsert(
          {
            email: user.email,
            user_id: user.id,
            trial_ends_at: new Date().toISOString(),
          },
          {
            onConflict: "email",
          },
        );
      }

      return NextResponse.json({
        success: true,
        refunded: true,
        partialRefund: true,
        refundAmount: refundAmount,
        message: `Subscription canceled. You'll receive a refund of €${refundAmount.toFixed(2)} for the unused period.`,
      });
    } else {
      // CANCEL AT PERIOD END (NO REFUND) - Monthly or yearly with period_end choice

      const canceledSubscription = await stripe.subscriptions.update(
        profile.stripe_subscription_id,
        {
          cancel_at_period_end: true,
        },
      );

      const cancelAt = (canceledSubscription as any).cancel_at;

      await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "active",
          cancel_at: cancelAt ? new Date(cancelAt * 1000).toISOString() : null,
        })
        .eq("id", user.id);

      if (user.email) {
        await supabaseAdmin.from("trial_history").upsert(
          {
            email: user.email,
            user_id: user.id,
            trial_ends_at: new Date().toISOString(),
          },
          {
            onConflict: "email",
          },
        );
      }

      return NextResponse.json({
        success: true,
        refunded: false,
        message:
          "Subscription will be canceled at the end of the billing period",
      });
    }
  } catch (error: any) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}
