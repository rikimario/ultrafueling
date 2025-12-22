import { GlassCard } from "./ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

export default function GlassHourlyPlan() {
  return (
    <GlassCard className="-translate-x-5 animate-float">
      <CardHeader className={cn("px-4")}>
        <CardTitle className="text-sm text-left">Hour 1</CardTitle>
      </CardHeader>
      <CardContent className={cn("px-4")}>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Calories</span>
            <span className="font-semibold">436 kcal</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Carbs</span>
            <span className="font-semibold">80 g</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Fluids</span>
            <span className="font-semibold">0.75 L</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sodium</span>
            <span className="font-semibold">450 mg</span>
          </div>

          <div className="mt-2 text-xs rounded-md dark:bg-gray-600 p-1">
            🍌 1 small banana + 1 gel + 200 ml water - start fueling early.
          </div>
        </div>
      </CardContent>
    </GlassCard>
  );
}
