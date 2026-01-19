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
  redirect("/");
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
  redirect("/");
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

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  try {
    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 1,
    });

    const customer = customers.data[0];

    if (customer) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
      });

      for (const sub of subs.data) {
        await stripe.subscriptions.cancel(sub.id);
      }
    }
  } catch (err: any) {
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

    // 1. Delete user data
    await supabase.from("user_plans").delete().eq("user_id", user.id);
    await supabase.from("user_preferences").delete().eq("user_id", user.id);

    // 2. Delete avatar files
    const { data: files } = await supabase.storage
      .from("avatars")
      .list(user.id);
    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${user.id}/${file.name}`);
      await supabase.storage.from("avatars").remove(filePaths);
    }

    // 3. Delete the user account using admin client
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id,
    );

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return { error: "Failed to delete account. Please try again." };
    }

    // 4. Sign out
    await supabase.auth.signOut();
  } catch (error: any) {
    console.error("Delete account error:", error);
    return { error: "An unexpected error occurred." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
