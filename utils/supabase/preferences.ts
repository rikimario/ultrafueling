import { createClient } from "./server";

export async function getPreferences(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }

  return data;
}
