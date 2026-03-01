import { Plan } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, Footprints, Target, TrendingUp } from "lucide-react";
import { QuickStatsSkeleton } from "../skeletions";

interface QuickStatsCardProps {
  plans: Plan[];
  loading: boolean;
}

export default function QuickStatsCard({
  plans,
  loading = false,
}: QuickStatsCardProps) {
  // const { loading } = useProfile();
  const stats = {
    totalPlans: plans.length || 0,
    totalHours: plans.reduce((total: number, plan: any) => {
      return total + (plan.result.durationHours || 0);
    }, 0),
    distanceRun: plans.reduce((total: number, plan: any) => {
      return total + (plan.result.distanceKm || 0);
    }, 0),
  };

  if (loading) {
    return <QuickStatsSkeleton />;
  }
  return (
    <Card className="mt-4 rounded-2xl shadow-md md:mt-0 md:w-full">
      <CardHeader>
        <CardTitle className="flex h-5 items-center justify-center gap-2 text-lg font-semibold">
          <TrendingUp className="h-5 w-5 text-[#a3ea2a]" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex h-5 items-center gap-2 text-sm">
            <Target className="h-4 w-4" />
            Saved Plans
          </span>
          <span className="h-5 font-semibold">{stats.totalPlans}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex h-5 items-center gap-2 text-sm">
            <Footprints className="h-4 w-4" />
            Total Distance
          </span>
          <span className="h-5 font-semibold">
            {stats.distanceRun.toFixed(1)} km
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex h-5 items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            Total Hours
          </span>
          <span className="h-5 font-semibold">
            {stats.totalHours.toFixed(1)} hrs
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
