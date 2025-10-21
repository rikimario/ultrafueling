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
    experienceLevel: "intermediate",
  });

  const [result, setResult] = useState<any>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
  };

  return (
    <section className="flex flex-col items-center justify-center my-12">
      <Card className={cn("lg:w-1/2")}>
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
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
