import {
  AdvancedResult,
  calculateAdvancedPlan,
} from "@/utils/calculator/calculatePlan";
import { useState } from "react";

export function useAdvancedCalc(user: any) {
  const [loading, setLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [result, setResult] = useState<AdvancedResult | null>(null);
  const [advancedInputState, setAdvancedInputState] = useState<any>(null);
  const [ready, setReady] = useState(false);

  const submitAdvancedCalc = async (advancedInput: any) => {
    setLoading(true);
    setReady(false);

    setAdvancedInputState(advancedInput);

    const advancedResult = calculateAdvancedPlan(advancedInput);

    try {
      const res = await fetch("/api/ai-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id ?? null,
          advancedInput: advancedInputState,
          advancedResult,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResult(advancedResult);
      setAiPlan(data.plan);
      setReady(true);
    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    submitAdvancedCalc,
    advancedInputState,
    result,
    loading,
    ready,
    aiPlan,
  };
}
