import React from "react";

import getUser from "@/utils/supabase/user";
import getSavedPlans from "@/utils/supabase/savedPlans";

import SavedPlansDialog from "./SavedPlansDialog";

export default async function SavedPlans() {
  const user = await getUser();

  if (!user) return null;

  const plans = await getSavedPlans(user.id);

  return <SavedPlansDialog plans={plans} />;
}
