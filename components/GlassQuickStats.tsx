import { Clock, Footprints, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { GlassCard } from "./ui/glass-card";

export default function GlassQuickStats() {
  return (
    <GlassCard className="animate-float-rotate">
      <CardTitle className="relative z-10 text-sm font-semibold mb-6 flex items-center justify-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        Quick Stats
      </CardTitle>

      <CardContent className="relative z-10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            Saved Plans
          </span>
          <span className="font-semibold">12</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Footprints className="w-4 h-4 text-emerald-400" />
            Distance
          </span>
          <span className="font-semibold">465</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Total Hours
          </span>
          <span className="font-semibold">340</span>
        </div>
      </CardContent>
    </GlassCard>
  );
}
