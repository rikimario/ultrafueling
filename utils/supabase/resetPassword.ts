import { createClient } from "./server";

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    console.error("Supabase reset password error:", error);
    return { error: error.message };
  }

  return { success: true, data };
}
