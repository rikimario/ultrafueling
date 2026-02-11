import { createClient } from "./server";

export type AppUser = {
  id: string;
  email: string | null;
  terms_accepted: boolean;
  privacy_accepted: boolean;
  terms_version: string | null;
  full_name: string | null;
  picture: string | null;
  profile: {
    stripe_customer_id: string | null;
    subscription_status: "active" | "trialing" | "canceled" | null;
    trial_ends_at: string | null;
  };
};

export default async function getUser(): Promise<AppUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("stripe_customer_id, subscription_status, trial_ends_at")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Profile fetch error:", profileError);
    return null;
  }

  return {
    id: user.id,
    email: user.email as string | null,
    terms_accepted: Boolean(user.user_metadata?.terms_accepted),
    privacy_accepted: Boolean(user.user_metadata?.privacy_accepted),
    terms_version: user.user_metadata?.terms_version ?? null,
    full_name: user.user_metadata?.full_name ?? null,
    picture: user.user_metadata?.picture ?? null,
    profile,
  };
}
