"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { AdvancedResult, HourlyPlan } from "@/utils/calculator/calculatePlan";
import StyledMarkdown from "../StyledMarkdown";
import { exportPlan } from "@/utils/exportPlan";
import { useProfile } from "@/hooks/useProfile";
import { Spinner } from "../ui/spinner";
import { Calculator, FolderOpen } from "lucide-react";
import Link from "next/link";

type SavedPlan = {
  id: string;
  created_at: string;
  input: any;
  result: AdvancedResult;
  ai_plan: string | null;
};

export default function SavedPlansDialog({ plans }: { plans: SavedPlan[] }) {
  const { loading, hasPremiumAccess } = useProfile();

  const handleDelete = async (id: string) => {
    await fetch("/api/delete-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: id }),
    });

    // Optional: refresh UI
    window.location.reload();
  };

  const handleExport = (plan: {
    results: AdvancedResult;
    aiPlan: string | null;
  }) => {
    exportPlan(plan);
  };

  return (
    <Card className="w-full p-6">
      <CardTitle className="mb-4 text-center text-2xl font-semibold">
        Saved Calculator Results
      </CardTitle>
      {/* Example Saved Result Card */}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="size-24" />
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="bg-muted/50 mb-4 rounded-full p-6">
            <FolderOpen className="text-muted-foreground/60 h-16 w-16" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No Saved Plans Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md text-center">
            Create your first fueling plan using the calculator and save it to
            access it here anytime.
          </p>
          {hasPremiumAccess ? (
            <Link href="/advanced-calc">
              <Button variant="main" className="gap-2">
                <Calculator className="h-4 w-4" />
                Create Your First Plan
              </Button>
            </Link>
          ) : (
            <Link href="/#subscribe">
              <Button variant="main" className="gap-2">
                <Calculator className="h-4 w-4" />
                Create Your First Plan
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <ScrollArea className="max-h-[70vh]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const input = plan.input;
              const result = plan.result;

              return (
                <Card key={plan.id} className="mb-4 rounded-xl p-4 shadow-sm">
                  <CardTitle className="text-lg font-semibold">
                    {input?.distanceKm} km Ultra
                  </CardTitle>

                  <p className="text-muted-foreground mt-1 text-sm">
                    Saved:{" "}
                    {new Date(plan.created_at).toISOString().split("T")[0]}
                  </p>

                  <CardContent className="mt-3 space-y-1 px-0 text-sm">
                    <p className="flex justify-between gap-2">
                      <strong className="text-muted-foreground">
                        Calories:
                      </strong>{" "}
                      {result?.totalCalories} kcal
                    </p>
                    <p className="flex justify-between gap-4">
                      <strong className="text-muted-foreground">Carbs:</strong>{" "}
                      {result?.totalCarbsGrams} g
                    </p>
                    <p className="flex justify-between gap-4">
                      <strong className="text-muted-foreground">
                        Hydration:
                      </strong>{" "}
                      {result?.totalFluidsL} L
                    </p>
                  </CardContent>

                  <Dialog>
                    <div className="mt-3 space-y-1">
                      <DialogTrigger asChild>
                        <Button className={cn("w-full")} variant={"secondary"}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <Button
                        variant={"destructive"}
                        className={cn("w-full")}
                        onClick={() => handleDelete(plan.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <DialogContent className={cn("sm:max-h-full sm:max-w-7xl")}>
                      <ScrollArea className="max-h-[85vh] md:p-6">
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <div className="rounded-2xl border p-4 shadow-sm">
                                <h3 className="text-muted-foreground text-sm font-medium">
                                  Race
                                </h3>
                                <p className="mt-2 text-lg font-semibold">
                                  {result.distanceKm} km •{" "}
                                  {result.durationHours} h
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {result.terrain} • {result.temperatureC}°C
                                </p>
                              </div>

                              <div className="rounded-2xl border p-4 shadow-sm">
                                <h3 className="text-muted-foreground text-sm font-medium">
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

                              <div className="rounded-2xl border p-4 shadow-sm">
                                <h3 className="text-muted-foreground text-sm font-medium">
                                  Packing (on-body)
                                </h3>
                                <p className="mt-2 text-base">
                                  {result.packing.packCarbsGrams} g carbs •{" "}
                                  {result.packing.packFluidsL} L
                                </p>
                                <p className="text-muted-foreground mt-1 text-sm">
                                  {result.packing.notes}
                                </p>
                                <div className="mt-3">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                      handleExport({
                                        results: plan.result,
                                        aiPlan: plan.ai_plan,
                                      })
                                    }
                                  >
                                    Export Checklist
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <h2 className="mb-4 text-lg font-semibold">
                          Hour-by-hour plan
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {result.hourly.map((h: HourlyPlan) => (
                            <Card
                              key={h.hourIndex}
                              className="transition-shadow hover:shadow-lg"
                            >
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  Hour {h.hourIndex}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">
                                      Calories
                                    </span>
                                    <span className="font-semibold">
                                      {h.calories} kcal
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">
                                      Carbs
                                    </span>
                                    <span className="font-semibold">
                                      {h.carbsGrams} g
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">
                                      Fluids
                                    </span>
                                    <span className="font-semibold">
                                      {h.fluidsL} L
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">
                                      Sodium
                                    </span>
                                    <span className="font-semibold">
                                      {h.sodiumMg} mg
                                    </span>
                                  </div>

                                  {h.notes && (
                                    <div className="mt-2 rounded-md p-2 text-sm dark:bg-gray-600">
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
                                <StyledMarkdown
                                  temperature={result.temperatureC}
                                >
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
        </ScrollArea>
      )}
    </Card>
  );
}
