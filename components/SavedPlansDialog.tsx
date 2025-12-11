"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { HourlyPlan } from "@/utils/calculator/calculatePlan";
import StyledMarkdown from "./StyledMarkdown";
import { exportPlan } from "@/utils/exportPlan";

export default function SavedPlansDialog({ plans }: { plans: any[] }) {
  const handleDelete = async (id: string) => {
    await fetch("/api/delete-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: id }),
    });

    // Optional: refresh UI
    window.location.reload();
  };

  const handleExport = (plan: any) => {
    exportPlan(plan);
  };

  return (
    <Card className="w-full p-6">
      <CardTitle className="text-xl font-semibold mb-4">
        Saved Calculator Results
      </CardTitle>

      {/* Example Saved Result Card */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const input = plan.input;
          const result = plan.result;

          return (
            <Card key={plan.id} className="p-4 rounded-xl mb-4 shadow-sm">
              <CardTitle className="font-semibold text-lg">
                {input?.distanceKm} km Ultra
              </CardTitle>

              <p className="text-muted-foreground text-sm mt-1">
                Saved: {new Date(plan.created_at).toISOString().split("T")[0]}
              </p>

              <CardContent className="mt-3 w-1/2 space-y-1 text-sm px-0">
                <p className="flex justify-between gap-4">
                  <strong className="text-muted-foreground">Calories:</strong>{" "}
                  {result?.totalCalories} kcal
                </p>
                <p className="flex justify-between gap-4">
                  <strong className="text-muted-foreground">Carbs:</strong>{" "}
                  {result?.totalCarbsGrams} g
                </p>
                <p className="flex justify-between gap-4">
                  <strong className="text-muted-foreground">Hydration:</strong>{" "}
                  {result?.totalFluidsL} L
                </p>
              </CardContent>

              <Dialog>
                <div className="mt-3">
                  <DialogTrigger asChild>
                    <Button variant={"secondary"}>View Details</Button>
                  </DialogTrigger>
                  {/* <DeleteSavedPlan plan={plan} /> */}
                  <Button
                    variant={"destructive"}
                    className="ml-2"
                    onClick={() => handleDelete(plan.id)}
                  >
                    Delete
                  </Button>
                </div>
                <DialogContent className={cn("sm:max-w-7xl sm:max-h-full")}>
                  <ScrollArea className="max-h-[85vh] p-6">
                    <DialogHeader>
                      <DialogTitle></DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
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
                              {result.distanceKm} km • {result.durationHours} h
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {result.terrain} • {result.temperatureC}°C
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl border shadow-sm">
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Targets
                            </h3>
                            <p className="mt-2 text-base">
                              {result.carbsPerHourGrams ??
                                result.carbsPerHourGrams}{" "}
                              g carbs / h
                            </p>
                            <p className="text-sm">
                              {result.fluidsPerHour} L fluids / h
                            </p>
                            <p className="text-sm">
                              {result.sodiumPerHourMg} mg sodium / h
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl border shadow-sm">
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Packing (on-body)
                            </h3>
                            <p className="mt-2 text-base">
                              {result.packing.packCarbsGrams} g carbs •{" "}
                              {result.packing.packFluidsL} L
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.packing.notes}
                            </p>
                            <div className="mt-3">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleExport(plan)}
                              >
                                Export Checklist
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h2 className="text-lg font-semibold mb-4">
                      Hour-by-hour plan
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.hourly.map((h: HourlyPlan) => (
                        <Card
                          key={h.hourIndex}
                          className="hover:shadow-lg transition-shadow"
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Hour {h.hourIndex}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Calories
                                </span>
                                <span className="font-semibold">
                                  {h.calories} kcal
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Carbs
                                </span>
                                <span className="font-semibold">
                                  {h.carbsGrams} g
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Fluids
                                </span>
                                <span className="font-semibold">
                                  {h.fluidsL} L
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Sodium
                                </span>
                                <span className="font-semibold">
                                  {h.sodiumMg} mg
                                </span>
                              </div>

                              {h.notes && (
                                <div className="mt-2 text-sm rounded-md dark:bg-gray-600 p-2">
                                  {h.notes}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-6">
                      {plan.ai_plan && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Notes & GI Tips
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <StyledMarkdown temperature={result.temperatureC}>
                              {plan.ai_plan}
                            </StyledMarkdown>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}
