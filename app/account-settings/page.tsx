import AccSettings from "@/components/AccSettings";
import { getPreferences } from "@/utils/supabase/preferences";
import getUser from "@/utils/supabase/user";
import { redirect } from "next/navigation";

export default async function AccountSettings() {
  const user = await getUser();

  if (!user) return redirect("/");

  const preferences = (await getPreferences(user.id)) ?? {
    weight: null,
    sweat_rate: null,
    exp_lvl: null,
    goal: null,
  };

  return (
    <div className="min-h-screen w-full px-4 py-4 bg-gray-50">
      <div className="w-full bg-white shadow-md rounded-2xl py-6 px-16 space-y-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Account Settings
        </h1>

        <AccSettings preferences={preferences} />
      </div>
    </div>
  );
}
