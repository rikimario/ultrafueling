import AccSettings from "@/components/AccSettings";
import { Card, CardTitle } from "@/components/ui/card";
import { getPreferences } from "@/utils/supabase/preferences";
import getUser from "@/utils/supabase/user";
import { redirect } from "next/navigation";

export default async function AccountSettings() {
  const user = await getUser();

  if (!user) return redirect("/");

  const preferences = (await getPreferences(user.id)) ?? {
    weightKg: null,
    sweatRateLPerHour: null,
    experienceLevel: null,
    goal: null,
  };

  return (
    <div className="min-h-screen w-full p-4">
      <Card className="w-full shadow-md rounded-2xl px-4 md:py-6 md:px-10 space-y-8">
        <CardTitle className="text-2xl text-center md:text-left font-semibold">
          Account Settings
        </CardTitle>

        <AccSettings preferences={preferences} />
      </Card>
    </div>
  );
}
