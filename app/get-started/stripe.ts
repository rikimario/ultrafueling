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

  // Fetch profile to check for existing customer and trial usage
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, trial_ends_at, subscription_status")
    .eq("id", user.id)
    .single();

  if (profile?.stripe_customer_id) {
    const subs = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: "active",
      limit: 1,
    });

    if (subs.data.length > 0) {
      return {
        url: null,
        error: "You already have a subscription",
      };
    }
  }

  // Prevent multiple trials
  const hasHadTrial = profile?.trial_ends_at !== null;

  if (trialDays && hasHadTrial) {
    return {
      url: null,
      error: "You have already used your free trial",
    };
  }

  const shouldApplyTrial = trialDays && !hasHadTrial;

  // If user already has active subscription, redirect to customer portal
  if (profile?.subscription_status === "active") {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id!,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    });
    return { url: portalSession.url };
  }

  const sessionConfig: any = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?canceled=true`,
    metadata: {
      userId: user.id, // ← CRITICAL: Add this for webhooks
    },
    subscription_data: {
      metadata: { userId: user.id },
    },
    allow_promotion_codes: true,
  };

  // Apply trial if eligible
  if (shouldApplyTrial) {
    sessionConfig.subscription_data = {
      trial_period_days: trialDays,
      metadata: { userId: user.id },
      trial_settings: {
        end_behavior: {
          missing_payment_method: "cancel",
        },
      },
    };
    sessionConfig.payment_method_collection = "if_required";
  } else {
    // Regular paid subscription
    sessionConfig.subscription_data = {
      metadata: { userId: user.id },
    };
  }

  let customerId = profile?.stripe_customer_id;

  // Create or find customer
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

    // ✅ ONLY save customer ID and set status to "pending"
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
