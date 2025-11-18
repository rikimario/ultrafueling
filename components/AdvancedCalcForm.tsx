"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AdvancedResult,
  calculateAdvancedPlan,
} from "@/utils/calculator/calculatePlan";
import React, { useState } from "react";
import AdvancedCalcResult from "./AdvancedCalcResult";

export default function AdvancedCalcForm({ user }: { user: any }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [form, setForm] = useState({
    distanceKm: "",
    durationHours: "",
    weightKg: "",
    temperatureC: "",
    humidityPct: "",
    paceMinPerKm: "",
    terrain: "",
    packWeightKg: "",
    sweatRateLPerHour: "",
    experienceLevel: "",
    goal: "",
    hasAidStations: "",
    aidStationGapHours: "",
  });
  const [result, setResult] = useState<AdvancedResult | null>(null);
  const [advancedInputState, setAdvancedInputState] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const advancedInput = {
      distanceKm: Number(form.distanceKm),
      durationHours: Number(form.durationHours),
      weightKg: Number(form.weightKg),
      temperatureC: Number(form.temperatureC),
      humidityPct: Number(form.humidityPct),
      paceMinPerKm: Number(form.paceMinPerKm),
      terrain: form.terrain as "flat" | "rolling" | "mountain",
      packWeightKg: Number(form.packWeightKg),
      sweatRateLPerHour: Number(form.sweatRateLPerHour),
      experienceLevel: form.experienceLevel as
        | "Beginner"
        | "Intermediate"
        | "Elite",
      goal: form.goal as "finish" | "performance",
      hasAidStations: Number(form.hasAidStations),
      aidStationGapHours: Number(form.aidStationGapHours),
    };
    setAdvancedInputState(advancedInput);

    // Step 1: calculate base plan
    const advancedResult = calculateAdvancedPlan(advancedInput);
    setResult(advancedResult);

    // Step 2: request AI plan
    try {
      const res = await fetch("/api/ai-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id ?? null,
          advancedInput,
          advancedResult,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiPlan(data.plan);
    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="flex flex-col items-center justify-center my-12">
      <Card className={cn("lg:w-1/2")}>
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
          <p className="text-lg font-medium p-6">Basic Info</p>
          <CardContent className={cn("grid grid-cols-2 gap-4 space-y-3")}>
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Distance (<span className="text-gray-500">km</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter distance"
                value={form.distanceKm}
                onChange={(e) => handleChange("distanceKm", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Duration (<span className="text-gray-500">hours</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter estimated duration"
                value={form.durationHours}
                onChange={(e) => handleChange("durationHours", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Weight (<span className="text-gray-500">kg</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter your weight"
                value={form.weightKg}
                onChange={(e) => handleChange("weightKg", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Temperature (<span className="text-gray-500">°C</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter temperature"
                value={form.temperatureC}
                onChange={(e) => handleChange("temperatureC", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>Experience level</Label>
              <Select
                onValueChange={(value) =>
                  handleChange("experienceLevel", value)
                }
              >
                <SelectTrigger className={cn("w-full")}>
                  <SelectValue placeholder="Select an experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Experience level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Elite">Elite</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          {/* Advanced Info */}
          <p className="text-lg font-medium p-6">Advanced Info</p>
          <CardContent className={cn("grid grid-cols-2 gap-4 space-y-3")}>
            <div className="space-y-2">
              <Label className={cn("px-1")}>Terrain</Label>
              <Select
                onValueChange={(value) =>
                  handleChange(
                    "terrain",
                    value as "flat" | "rolling" | "mountain"
                  )
                }
              >
                <SelectTrigger className={cn("w-full")}>
                  <SelectValue placeholder="Select a terrain type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Terrain type</SelectLabel>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="rolling">Rolling</SelectItem>
                    <SelectItem value="mountain">Mountain</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Pack weight (<span className="text-gray-500">kg</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter pack weight"
                value={form.packWeightKg}
                onChange={(e) => handleChange("packWeightKg", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Sweat rate (<span className="text-gray-500">L/hour</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter sweat rate"
                value={form.sweatRateLPerHour}
                onChange={(e) =>
                  handleChange("sweatRateLPerHour", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>Goal</Label>
              <Select
                onValueChange={(value) =>
                  handleChange("goal", value as "finish" | "performance")
                }
              >
                <SelectTrigger className={cn("w-full")}>
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Goal</SelectLabel>
                    <SelectItem value="finish">Finish</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>Aid stations</Label>
              <Input
                value={form.hasAidStations}
                type="number"
                placeholder="Enter aid stations"
                onChange={(e) => handleChange("hasAidStations", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Aid station gap (<span className="text-gray-500">hours</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter aid station gap"
                value={form.aidStationGapHours}
                onChange={(e) =>
                  handleChange("aidStationGapHours", e.target.value)
                }
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center my-4">
            <Button type="submit" className="w-1/2">
              Calculate
            </Button>
          </CardFooter>
        </form>
      </Card>

      {result && (
        <>
          <AdvancedCalcResult results={result} aiPlan={aiPlan} />
          <Button
            disabled={saving || saved}
            className="mt-4"
            onClick={async () => {
              setSaving(true);
              try {
                const res = await fetch("/api/save-plan", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: user?.id,
                    advancedInput: advancedInputState,
                    advancedResult: result,
                    aiPlan,
                  }),
                });

                const data = await res.json();
                if (!data.success) throw new Error(data.error);
                setSaved(true);
              } catch (err) {
                console.error("Save error:", err);
              } finally {
                setSaving(false);
              }
            }}
          >
            {saved ? "Saved ✓" : saving ? "Saving..." : "Save Plan"}
          </Button>
        </>
      )}
    </section>
  );
}
