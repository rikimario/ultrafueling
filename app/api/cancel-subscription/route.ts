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
      .select("stripe_subscription_id, subscription_status, subscribed_at")
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

    // Check if within 30-day money-back guarantee period
    const subscribedAt = new Date(profile.subscribed_at);
    const daysSinceSubscribed = Math.floor(
      (Date.now() - subscribedAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    const isWithinMoneyBackPeriod = daysSinceSubscribed <= 30;

    if (isWithinMoneyBackPeriod) {
      // IMMEDIATE CANCELLATION WITH FULL REFUND

      // Get the subscription to find the latest invoice
      const subscription = await stripe.subscriptions.retrieve(
        profile.stripe_subscription_id,
      );

      const latestInvoiceId =
        typeof subscription.latest_invoice === "string"
          ? subscription.latest_invoice
          : subscription.latest_invoice?.id;

      if (latestInvoiceId) {
        // Get the invoice to find the payment intent
        const invoice = await stripe.invoices.retrieve(latestInvoiceId);

        // Use as any to access payment_intent
        const paymentIntentId = (invoice as any).payment_intent;

        if (paymentIntentId) {
          const piId =
            typeof paymentIntentId === "string"
              ? paymentIntentId
              : paymentIntentId.id;

          // Issue full refund
          await stripe.refunds.create({
            payment_intent: piId,
            reason: "requested_by_customer",
          });
        }
      }

      // Cancel subscription immediately
      await stripe.subscriptions.cancel(profile.stripe_subscription_id);

      // Update database - subscription will be marked as canceled by webhook
      return NextResponse.json({
        success: true,
        refunded: true,
        message: "Subscription canceled and refunded successfully",
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
