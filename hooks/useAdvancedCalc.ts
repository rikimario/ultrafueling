import {
  AdvancedResult,
  calculateAdvancedPlan,
} from "@/utils/calculator/calculatePlan";
import { useState } from "react";
import { toast } from "sonner";

let lastRateLimitToast = 0;

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
          advancedInput,
          advancedResult,
        }),
      });

      const data = await res.json();

      // ✅ Handle rate limiting
      if (res.status === 429) {
        const waitTime = data.retryAfter || 60;
        const now = Date.now();

        // Only show toast if last one was >3 seconds ago
        if (now - lastRateLimitToast > 3000) {
          lastRateLimitToast = now;

          toast.error(`Rate limit reached. Please wait ${waitTime} seconds.`, {
            duration: 5000,
            id: "rate-limit",
          });
        }

        throw new Error(data.message || "Rate limit exceeded");
      }

      // ✅ Handle other errors
      if (!res.ok || data.error) {
        if (res.status === 401) {
          toast.error("Please log in to use this feature");
        } else if (res.status === 403) {
          toast.error("Premium subscription required");
        } else {
          toast.error(data.message || data.error || "Failed to generate plan");
        }
        throw new Error(data.error || "Request failed");
      }

      setResult(advancedResult);
      setAiPlan(data.plan);
      setReady(true);
      toast.success("Fueling plan generated!");
    } catch (err: any) {
      console.error("AI error:", err);
      setResult(null);
      setAiPlan(null);
      // ✅ RE-THROW the error so the test function can catch it
      throw err;
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
