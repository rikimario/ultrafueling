"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { calculateNutritionPlan } from "@/utils/calculator/calculatePlan";
import { Button } from "./ui/button";
import { getFuelingSuggestions } from "@/utils/calculator/getFuelingSuggestions";

export default function CalcForm() {
  const [form, setForm] = useState({
    distanceKm: "",
    durationHours: "",
    weightKg: "",
    temperatureC: "",
    experienceLevel: "",
    distanceKmError: "",
    durationHoursError: "",
    weightKgError: "",
    temperatureCError: "",
    experienceLevelError: "",
  });

  const [result, setResult] = useState<any>(null);

  const setFormWithErrors = (errors: Partial<{ [key: string]: string }>) => {
    setForm((prev) => ({
      ...prev,
      ...errors,
    }));
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.distanceKm ||
      !form.durationHours ||
      !form.weightKg ||
      !form.temperatureC ||
      !form.experienceLevel
    ) {
      // Display an error message
      setFormWithErrors({
        distanceKmError: form.distanceKm
          ? ""
          : "This field should not be empty!",
        durationHoursError: form.durationHours
          ? ""
          : "This field should not be empty!",
        weightKgError: form.weightKg ? "" : "This field should not be empty!",
        temperatureCError: form.temperatureC
          ? ""
          : "This field should not be empty!",
        experienceLevelError: form.experienceLevel
          ? ""
          : "This field should not be empty!",
      });
      return;
    }

    const userInput = {
      distanceKm: Number(form.distanceKm),
      durationHours: Number(form.durationHours),
      weightKg: Number(form.weightKg),
      temperatureC: Number(form.temperatureC),
      experienceLevel: form.experienceLevel as
        | "Beginner"
        | "Intermediate"
        | "Elite",
    };

    const data = calculateNutritionPlan(userInput);
    setResult({
      ...data,
      suggestions: getFuelingSuggestions(data),
    });

    setForm({
      distanceKm: "",
      durationHours: "",
      weightKg: "",
      temperatureC: "",
      experienceLevel: "",
      distanceKmError: "",
      durationHoursError: "",
      weightKgError: "",
      temperatureCError: "",
      experienceLevelError: "",
    });
  };

  return (
    <section
      id="freeCalc"
      className="relative flex flex-col items-center justify-center my-12"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[600px] bg-[#0080ff11] blur-3xl rounded-full" />
      </div>

      <div className="text-center my-10 space-y-4">
        <h1 className="font-bold text-4xl">Try the free calculator</h1>
        <p className="text-muted-foreground text-center text-xl max-w-2xl mx-auto">
          Get an instant fueling estimate based on your race, pace, and
          conditions - no account required.
        </p>
      </div>
      <Card className={cn("relative w-full md:w-2/3 lg:w-1/2")}>
        {/* Decorative top line */}
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />
        <CardHeader className={cn("text-center")}>
          <CardTitle className={cn("text-3xl font-bold")}>
            Calculate Your Running Nutrition
          </CardTitle>
          <CardDescription className={cn("text-lg font-medium")}>
            Enter your running details to calculate your estimated nutrition
            intake.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent
            className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 space-y-3")}
          >
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Distance (<span className="text-[#99CCFF]">km</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter distance"
                value={form.distanceKm}
                onChange={(e) => handleChange("distanceKm", e.target.value)}
              />
              {form.distanceKmError && (
                <p className="text-destructive text-xs ml-2">
                  {form.distanceKmError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Duration (<span className="text-[#99CCFF]">hours</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter estimated duration"
                value={form.durationHours}
                onChange={(e) => handleChange("durationHours", e.target.value)}
              />
              {form.durationHoursError && (
                <p className="text-destructive text-xs ml-2">
                  {form.durationHoursError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Weight (<span className="text-[#99CCFF]">kg</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter your weight"
                value={form.weightKg}
                onChange={(e) => handleChange("weightKg", e.target.value)}
              />
              {form.weightKgError && (
                <p className="text-destructive text-xs ml-2">
                  {form.weightKgError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className={cn("px-1")}>
                Temperature (<span className="text-[#99CCFF]">°C</span>)
              </Label>
              <Input
                type="number"
                placeholder="Enter temperature"
                value={form.temperatureC}
                onChange={(e) => handleChange("temperatureC", e.target.value)}
              />
              {form.temperatureCError && (
                <p className="text-destructive text-xs ml-2">
                  {form.temperatureCError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="experianceLevel" className={cn("px-1")}>
                Experience level
              </Label>
              <Select
                value={form.experienceLevel}
                onValueChange={(value) =>
                  handleChange("experienceLevel", value)
                }
              >
                <SelectTrigger id="experianceLevel" className={cn("w-full")}>
                  <SelectValue placeholder="Select an experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Experience level</SelectLabel>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {form.experienceLevelError && (
                <p className="text-destructive text-xs ml-2">
                  {form.experienceLevelError}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center my-4">
            <Button variant={"main"} type="submit" className={cn("w-1/2")}>
              Calculate
            </Button>
          </CardFooter>
        </form>
      </Card>

      {result && (
        <Card className={cn("lg:w-1/2 mt-8")}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Your Nutrition Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid md:grid-cols-2 gap-2">
              <p>
                <strong>Total Calories:</strong> {result.totalCalories} kcal
              </p>
              <p>
                <strong>Total Hydration:</strong> {result.totalHydration} L
              </p>
              <p>
                <strong>Total Sodium:</strong> {result.totalSodiumMg} mg
              </p>
              <p>
                <strong>Total Potassium:</strong> {result.totalPotassiumMg} mg
              </p>
              <p>
                <strong>Total Magnesium:</strong> {result.totalMagnesiumMg} mg
              </p>
            </div>

            <div className="mt-4 border-t pt-4">
              <p className="font-semibold mb-2">Per Hour:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>{result.hourly.calories} kcal/hour</li>
                <li>{result.hourly.hydration} L/hour</li>
                <li>{result.hourly.sodium} mg sodium/hour</li>
                <li>{result.hourly.potassium} mg potassium/hour</li>
                <li>{result.hourly.magnesium} mg magnesium/hour</li>
              </ul>

              {result.suggestions && (
                <div className="mt-6 border-t pt-4">
                  <p className="font-semibold mb-2 text-lg">
                    💡 Suggested Fueling Plan
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {result.suggestions.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
