import { GlassCard } from "./ui/glass-card";
import { CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export default function GlassSavedPlans() {
  return (
    <GlassCard className="-translate-x-2 animate-float text-left p-4">
      <CardTitle className="font-semibold text-sm">80 km Ultra</CardTitle>

      <p className="text-muted-foreground text-sm mt-1">Saved: 2025-11-26</p>

      <CardContent className="mt-3 space-y-1 text-sm px-0">
        <p className="flex justify-between gap-">
          <span className="text-muted-foreground">Calories:</span>{" "}
          <span className="font-semibold">4358 kcal</span>
        </p>
        <p className="flex justify-between gap-4">
          <span className="text-muted-foreground">Carbs:</span>{" "}
          <span className="font-semibold">800 g</span>
        </p>
        <p className="flex justify-between gap-4">
          <span className="text-muted-foreground">Hydration:</span>{" "}
          <span className="font-semibold">7.5 L</span>
        </p>
      </CardContent>

      <div className="mt-3 flex gap-2">
        <Button variant={"secondary"}>View Details</Button>
        {/* <DeleteSavedPlan plan={plan} /> */}
        <Button variant={"destructive"} className="">
          Delete
        </Button>
      </div>
    </GlassCard>
  );
}
