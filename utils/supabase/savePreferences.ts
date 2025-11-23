import { createClient } from "./server";

export type Preferences = {
  weight: number | null;
  sweat_rate: number | null;
  exp_lvl: "Beginner" | "Intermediate" | "Elite" | null;
  goal: "finish" | "performance" | null;
};

export default async function savePreferences(
  userId: string,
  preferences: Preferences
) {
  const supabase = await createClient();

  const { error } = await supabase.from("user_preferances").upsert({
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
