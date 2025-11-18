import { createClient } from "./server";

export default async function getSavedPlans(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved plans:", error);
    return [];
  }

  return data;
}
