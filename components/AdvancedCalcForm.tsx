"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import AdvancedCalcResult from "./AdvancedCalcResult";
import PrefCheckbox from "./PrefCheckbox";
import { validateForm } from "@/utils/calculator/validation";
import { useAdvancedCalc } from "@/hooks/useAdvancedCalc";
import { buildAdvancedInput } from "@/utils/calculator/buildAdvancedInput";
import { ADVANCED_FORM_DEFAULTS } from "@/utils/calculator/formDefaults";
import { useSavePlan } from "@/hooks/useSavePlan";
import CalcBasicInfo from "./CalcBasicInfo";
import CalcAdvanceInfo from "./CalcAdvanceInfo";
import LoadingSpinner from "./LoadingSpinner";

export default function AdvancedCalcForm({ user }: { user: any }) {
  const [form, setForm] = useState(ADVANCED_FORM_DEFAULTS);
  const [usePreferences, setUsePreferences] = useState(false);
  const {
    loading,
    ready,
    result,
    aiPlan,
    submitAdvancedCalc,
    advancedInputState,
  } = useAdvancedCalc(user);
  const { saving, saved, savePlan } = useSavePlan(user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(form);
    if (Object.keys(errors).length) {
      setForm((prev) => ({ ...prev, ...errors }));
      return;
    }

    submitAdvancedCalc(buildAdvancedInput(form));
  };
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!advancedInputState || !result || !aiPlan) return;

    savePlan({
      advancedInput: advancedInputState,
      advancedResult: result,
      aiPlan,
    });
  };

  const loadPreferences = async () => {
    const res = await fetch("/api/check-preferences");
    const data = await res.json();

    if (!data?.preferences) return;

    const p = data.preferences;

    setForm((prev) => ({
      ...prev,
      weightKg: p.weightKg?.toString() || "",
      sweatRateLPerHour: p.sweatRateLPerHour?.toString() || "",
      experienceLevel: p.experienceLevel || "",
      goal: p.goal || "",
    }));
  };
  const resetPrefFields = () => {
    setForm((prev) => ({
      ...prev,
      weightKg: "",
      sweatRateLPerHour: "",
      experienceLevel: "",
      goal: "",
    }));
  };

  const handlePrefToggle = async (checked: boolean) => {
    setUsePreferences(checked);

    if (checked) {
      await loadPreferences();
    } else {
      resetPrefFields();
    }
  };

  return (
    <section className="relative my-12 flex flex-col items-center justify-center">
      <Card className={cn("relative z-10 lg:w-1/2")}>
        {/* Decorative top line */}
        <span className="to-transparent] absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF]" />
        <CardHeader className={cn("text-center")}>
          <CardTitle className={cn("text-3xl font-bold")}>
            Advanced Ultra Fueling Calculator
          </CardTitle>
          <CardDescription className={cn("text-lg font-medium")}>
            Enter your running details to calculate your estimated nutrition
            intake.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <span className="flex items-center gap-2 px-6 py-2">
            <PrefCheckbox
              checked={usePreferences}
              onChange={handlePrefToggle}
            />
          </span>

          {/* Basic Info */}
          <p className="p-6 text-lg font-medium">Basic Info</p>
          <CalcBasicInfo form={form} handleChange={handleChange} />

          {/* Advanced Info */}
          <p className="p-6 text-lg font-medium">Advanced Info</p>
          <CalcAdvanceInfo form={form} handleChange={handleChange} />

          {/* Footer */}
          <CardFooter className="my-4 flex justify-center">
            <Button
              variant={"main"}
              type="submit"
              disabled={loading}
              className={cn("w-1/2")}
            >
              {loading ? "Calculating..." : "Calculate"}
            </Button>
          </CardFooter>
        </form>

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}
      </Card>

      {/* Result */}
      {ready && result && aiPlan && (
        <>
          <AdvancedCalcResult results={result} aiPlan={aiPlan} />
          <Button
            variant={"secondary"}
            disabled={saving || saved}
            className="mt-4"
            onClick={handleSave}
          >
            {saved ? "Saved ✓" : saving ? "Saving..." : "Save Plan"}
          </Button>
        </>
      )}
    </section>
  );
}
