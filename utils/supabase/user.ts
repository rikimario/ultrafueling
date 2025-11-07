import { createClient } from "./server";

export default async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return { ...user, is_premium: false };
  }

  return { ...user, is_premium: profile?.is_premium ?? false };
}
