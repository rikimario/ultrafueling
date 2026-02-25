"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createServiceClient } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/lib/stripe";
import { CURRENT_TERMS_VERSION } from "@/utils/terms";

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Missing email or phone")) {
      return { error: "Please enter both email and password." };
    }
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Incorrect email or password." };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
  // redirect("/");
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const full_name = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!full_name || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
        terms_version: CURRENT_TERMS_VERSION,
        privacy_accepted: true,
      },
    },
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }
  revalidatePath("/", "layout");
  return { success: true };
  // redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function deleteAccount() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  try {
    // Get profile data first (before deleting)
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "trial_ends_at, subscribed_at, subscription_plan, subscription_status, stripe_subscription_id",
      )
      .eq("id", user.id)
      .single();

    // Cancel Stripe subscriptions with refunds
    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 1,
    });

    const customer = customers.data[0];

    if (customer && profile?.subscription_status === "active") {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
      });

      for (const sub of subs.data) {
        const subscribedAt = profile.subscribed_at
          ? new Date(profile.subscribed_at)
          : null;
        const daysSinceSubscribed = subscribedAt
          ? Math.floor(
              (Date.now() - subscribedAt.getTime()) / (1000 * 60 * 60 * 24),
            )
          : null;
        const isWithinMoneyBackPeriod =
          daysSinceSubscribed !== null && daysSinceSubscribed <= 30;
        const isYearlyPlan =
          profile.subscription_plan ===
          process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY;

        // Get the latest charge for refund
        const charges = await stripe.charges.list({
          customer: customer.id,
          limit: 5,
        });

        if (charges.data.length > 0) {
          const latestCharge = charges.data[0];

          if (latestCharge.paid && !latestCharge.refunded) {
            if (isWithinMoneyBackPeriod) {
              // Full refund (30-day money-back guarantee)
              await stripe.refunds.create({
                charge: latestCharge.id,
                reason: "requested_by_customer",
              });
              console.log("✅ Full refund issued (30-day money-back)");
            } else if (isYearlyPlan && subscribedAt) {
              // Partial refund for yearly plan
              const now = Date.now();
              const oneYear = 365 * 24 * 60 * 60 * 1000;
              const timeUsed = now - subscribedAt.getTime();
              const timeRemaining = oneYear - timeUsed;
              const refundPercentage = Math.max(0, timeRemaining / oneYear);
              const refundAmountCents = Math.floor(
                latestCharge.amount * refundPercentage,
              );

              if (refundAmountCents > 0) {
                await stripe.refunds.create({
                  charge: latestCharge.id,
                  amount: refundAmountCents,
                  reason: "requested_by_customer",
                });
                console.log(
                  `✅ Partial refund issued: €${(refundAmountCents / 100).toFixed(2)}`,
                );
              }
            }
          }
        }

        // Cancel subscription immediately
        await stripe.subscriptions.cancel(sub.id);
      }
    } else if (customer) {
      // Just cancel if no active subscription
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
      });

      for (const sub of subs.data) {
        await stripe.subscriptions.cancel(sub.id);
      }
    }
  } catch (err: any) {
    console.error("Stripe cancellation error:", err);
    return { error: err.message };
  }

  try {
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Get profile data again to save trial history
    const { data: profile } = await supabase
      .from("profiles")
      .select("trial_ends_at, subscribed_at")
      .eq("id", user.id)
      .single();

    // Save to trial history (prevents re-trials)
    if (profile?.trial_ends_at || profile?.subscribed_at) {
      await supabaseAdmin.from("trial_history").upsert(
        {
          email: user.email!,
          user_id: user.id,
          trial_ends_at: profile.trial_ends_at || new Date().toISOString(),
        },
        {
          onConflict: "email",
        },
      );
    }

    // Delete user data
    await supabase.from("user_plans").delete().eq("user_id", user.id);
    await supabase.from("user_preferences").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);

    // Delete avatar files
    const { data: files } = await supabase.storage
      .from("avatars")
      .list(user.id);
    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${user.id}/${file.name}`);
      await supabase.storage.from("avatars").remove(filePaths);
    }

    // Delete the user account
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id,
    );

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return { error: "Failed to delete account. Please try again." };
    }

    // Sign out
    await supabase.auth.signOut();
  } catch (error: any) {
    console.error("Delete account error:", error);
    return { error: "An unexpected error occurred." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
