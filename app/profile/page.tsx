"use client";

import ProfileCard from "@/components/profile/ProfileCard";
import QuickStatsCard from "@/components/profile/QuickStatsCard";
import SavedPlans from "@/components/profile/SavedPlans";
import SubscriptionInfo from "@/components/profile/SubscriptionInfoCard";
import { CardContent, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Plan } from "@/types/plan";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user } = useUser();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && loading) {
      fetchPlans();
    }
  }, [user?.id]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/get-saved-plan");
      const data = await res.json();
      if (data.error) {
        console.error("Error fetching plans:", data.error);
        setPlans([]);
      } else {
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6">
      <CardTitle className="mb-6 px-6 text-3xl font-bold">
        Your Profile
      </CardTitle>

      <CardContent className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_3fr]">
        {/* Left Profile Info */}
        <div className="gap-12 md:flex md:justify-between lg:flex-col">
          <ProfileCard loading={loading} />

          {/* Quick Stats Card */}
          <QuickStatsCard plans={plans} loading={loading} />

          {/* Subscription Info */}
          <SubscriptionInfo />
        </div>

        {/* Right Saved Results Section */}
        <SavedPlans />
      </CardContent>
    </div>
  );
}
