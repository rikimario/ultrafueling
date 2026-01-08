import { useState } from "react";

export function useSavePlan(user: any) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const savePlan = async ({
    advancedInput,
    advancedResult,
    aiPlan,
  }: {
    advancedInput: any;
    advancedResult: any;
    aiPlan: string;
  }) => {
    setSaving(true);

    try {
      const res = await fetch("/api/save-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id ?? null,
          advancedInput,
          advancedResult,
          aiPlan,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSaved(true);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return {
    savePlan,
    saving,
    saved,
  };
}
