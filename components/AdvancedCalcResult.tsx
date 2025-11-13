import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AdvancedResult } from "@/utils/calculator/calculatePlan";

export default function AdvancedCalcResult({
  results,
}: {
  results: AdvancedResult;
}) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Ultra Fueling Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">
                Race
              </h3>
              <p className="mt-2 font-semibold text-lg">
                {results.distanceKm} km • {results.durationHours} h
              </p>
              <p className="text-sm text-muted-foreground">
                {results.terrain} • {results.temperatureC}°C
              </p>
            </div>

            <div className="p-4 rounded-2xl border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">
                Targets
              </h3>
              <p className="mt-2 text-base">
                {results.carbsPerHourGrams ?? results.carbsPerHourGrams} g carbs
                / h
              </p>
              <p className="text-sm">{results.fluidsPerHour} L fluids / h</p>
              <p className="text-sm">{results.sodiumPerHourMg} mg sodium / h</p>
            </div>

            <div className="p-4 rounded-2xl border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">
                Packing (on-body)
              </h3>
              <p className="mt-2 text-base">
                {results.packing.packCarbsGrams} g carbs •{" "}
                {results.packing.packFluidsL} L
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {results.packing.notes}
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm">
                  Export Checklist
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold mb-4">Hour-by-hour plan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.hourly.map((h) => (
          <Card key={h.hourIndex} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Hour {h.hourIndex}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Calories
                  </span>
                  <span className="font-semibold">{h.calories} kcal</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Carbs</span>
                  <span className="font-semibold">{h.carbsGrams} g</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fluids</span>
                  <span className="font-semibold">{h.fluidsL} L</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sodium</span>
                  <span className="font-semibold">{h.sodiumMg} mg</span>
                </div>

                {h.notes && (
                  <div className="mt-2 text-sm rounded-md bg-muted/20 p-2">
                    {h.notes}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="ghost">
                    Use gels
                  </Button>
                  <Button size="sm" variant="ghost">
                    Use solids
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes & GI Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-decimal pl-5 space-y-2 text-sm">
              <li>
                Start fueling within first 20 minutes; small frequent sips
                (150–200 mL every 10–15 min).
              </li>
              <li>
                If nausea: switch to plain water for 15–30 min, then resume
                dilute carbs.
              </li>
              <li>
                Use aid stations to refill and swap flavors; carry only 2 h of
                on-body fuel.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
