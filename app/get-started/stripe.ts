"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  priceId: string;
  trialDays?: number;
};

export async function subscribeAction({
  priceId,
  trialDays,
}: Props): Promise<{ url: string | null; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/get-started");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "stripe_customer_id, stripe_subscription_id, trial_ends_at, subscription_status, subscription_plan",
    )
    .eq("id", user.id)
    .single();

  // ✅ Check trial history table by email (survives account deletion)
  const { data: trialHistory } = await supabase
    .from("trial_history")
    .select("trial_ends_at")
    .eq("email", user.email!)
    .limit(1)
    .single();

  const hasHadTrial = profile?.trial_ends_at !== null || trialHistory !== null;

  if (trialDays && hasHadTrial) {
    return {
      url: null,
      error: "You have already used your free trial",
    };
  }

  const shouldApplyTrial = trialDays && !hasHadTrial;

  // ✅ USER HAS ACTIVE PAID SUBSCRIPTION - SWITCH IT
  if (
    profile?.stripe_subscription_id &&
    profile?.subscription_status === "active" &&
    !shouldApplyTrial // Don't switch if they're trying to start a trial
  ) {
    try {
      const currentSub = await stripe.subscriptions.retrieve(
        profile.stripe_subscription_id,
      );

      const updatedSubscription = await stripe.subscriptions.update(
        profile.stripe_subscription_id,
        {
          items: [
            {
              id: currentSub.items.data[0].id,
              price: priceId,
            },
          ],
          proration_behavior: "create_prorations",
        },
      );

      await supabase
        .from("profiles")
        .update({
          subscription_plan: priceId,
        })
        .eq("id", user.id);

      return {
        url: null,
        error: undefined,
      };
    } catch (error: any) {
      console.error("Subscription update error:", error);
      return {
        url: null,
        error: "Failed to switch plan. Please try again.",
      };
    }
  }

  // ✅ USER ON TRIAL - UPGRADING TO PAID
  // Don't cancel the trial, just let them add payment method
  // The trial will convert to paid subscription automatically

  // ✅ CREATE NEW SUBSCRIPTION OR CHECKOUT
  const sessionConfig: any = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?canceled=true`,
    metadata: {
      userId: user.id,
    },
    subscription_data: {
      metadata: { userId: user.id },
    },
    allow_promotion_codes: true,
  };

  if (shouldApplyTrial) {
    sessionConfig.subscription_data = {
      trial_period_days: trialDays,
      metadata: { userId: user.id },
      trial_settings: {
        end_behavior: {
          missing_payment_method: "cancel", // Cancel trial if no payment
        },
      },
    };
    sessionConfig.payment_method_collection = "if_required";
  }

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const existingCustomers = await stripe.customers.list({
      email: user.email!,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
    }

    await supabase
      .from("profiles")
      .update({
        stripe_customer_id: customerId,
        subscription_status: "pending",
      })
      .eq("id", user.id);
  }

  sessionConfig.customer = customerId;

  const session = await stripe.checkout.sessions.create(sessionConfig);

  if (!session.url) throw new Error("Stripe session failed");

  return { url: session.url };
}
