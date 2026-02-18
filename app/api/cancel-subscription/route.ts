import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "stripe_subscription_id, subscription_status, subscribed_at, stripe_customer_id",
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

    if (isWithinMoneyBackPeriod) {
      // IMMEDIATE CANCELLATION WITH FULL REFUND

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

      // ✅ ADD: Mark user as having used their trial privilege
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
    } else {
      // CANCEL AT PERIOD END (NO REFUND)

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

      // ✅ ADD: Mark user as having used their trial privilege
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
