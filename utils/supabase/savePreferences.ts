import { createClient } from "./server";

export type Preferences = {
  weightKg: number | null;
  sweatRateLPerHour: number | null;
  experienceLevel: "Beginner" | "Intermediate" | "Elite" | null;
  goal: "finish" | "performance" | null;
};

export default async function savePreferences(
  userId: string,
  preferences: Preferences
) {
  const supabase = await createClient();

  const { error } = await supabase.from("user_preferences").upsert({
    user_id: userId,
    ...preferences,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error saving preferences:", error);
    throw new Error(error.message);
  }

  return true;
}
