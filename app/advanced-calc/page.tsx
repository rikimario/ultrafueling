import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdvancedCalcForm from "@/components/AdvancedCalcForm";

export default async function AdvancedCalcPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/get-started");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  const allowed =
    profile?.subscription_status === "active" ||
    profile?.subscription_status === "trialing";

  if (!allowed) {
    redirect("/#subscribe");
  }

  return <AdvancedCalcForm user={user} />;
}
