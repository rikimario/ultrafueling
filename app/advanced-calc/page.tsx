import AdvancedCalcForm from "@/components/AdvancedCalcForm";
import getUser from "@/utils/supabase/user";
import { redirect } from "next/navigation";

export default async function AdvancedCalc() {
  const user = await getUser();

  if (!user?.is_premium) {
    redirect("/");
  }
  return <AdvancedCalcForm user={user} />;
}
