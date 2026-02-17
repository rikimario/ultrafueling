"use client";

import SavedPlans from "@/components/SavedPlans";
import SubscriptionInfo from "@/components/SubscriptionInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Footprints,
  Mail,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Plan {
  result: {
    durationHours: number;
    distanceKm: number;
  };
}

export default function Profile() {
  const { user, avatarUrl } = useUser();
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
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
    }
  };

  const stats = {
    totalPlans: plans.length || 0,
    totalHours: plans.reduce((total, plan) => {
      return total + (plan.result.durationHours || 0);
    }, 0),
    distanceRun: plans.reduce((total, plan) => {
      return total + (plan.result.distanceKm || 0);
    }, 0),
    memberSince: new Date(user?.created_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };
  return (
    <div className="min-h-screen py-6">
      <CardTitle className="mb-6 px-6 text-3xl font-bold">
        Your Profile
      </CardTitle>

      <CardContent className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_3fr]">
        {/* Left Profile Info */}
        <div className="gap-12 md:flex md:justify-between lg:flex-col">
          <Card className="col-span-1 max-h-96 rounded-2xl p-6 shadow-md md:w-full">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="profile_picture"
                width={200}
                height={200}
                className="mx-auto mb-4 h-32 w-32 cursor-pointer rounded-full border-3 border-gray-500 object-cover transition duration-300 ease-in-out hover:border-[#a3ea2a]"
                priority
              />
            ) : (
              <UserRound
                className="mx-auto mb-4 h-32 w-32 rounded-full border-3 border-gray-500 transition duration-300 ease-in-out hover:border-[#a3ea2a]"
                strokeWidth={0.3}
                width={100}
                height={100}
              />
            )}
            <div className="text-center">
              <p className="mb-2 text-2xl font-semibold">{user?.full_name}</p>
              <p className="text-muted-foreground mb-2 flex items-center justify-center gap-2">
                <Mail width={15} height={15} /> {user?.email}
              </p>
              <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1 text-sm">
                <Calendar width={14} height={14} />
                Member since {stats.memberSince}
              </p>
            </div>

            <Link href="/account-settings">
              <Button variant={"main"} className={cn("w-full")}>
                Edit Profile
              </Button>
            </Link>
          </Card>

          {/* Quick Stats Card */}
          <Card className="mt-4 rounded-2xl p-6 shadow-md md:mt-0 md:h-2/3 md:w-full">
            <CardTitle className="mb-4 flex items-center justify-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-[#a3ea2a]" />
              Quick Stats
            </CardTitle>
            <CardContent className="h-1/2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4" />
                  Saved Plans
                </span>
                <span className="font-semibold">{stats.totalPlans}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Footprints className="h-4 w-4" />
                  Distnace
                </span>
                <span className="font-semibold">{stats.distanceRun}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Total Hours
                </span>
                <span className="font-semibold">{stats.totalHours}</span>
              </div>
            </CardContent>
          </Card>
          {/* Subscription Info */}
          <SubscriptionInfo />
        </div>

        {/* Right Saved Results Section */}
        <SavedPlans />
      </CardContent>
    </div>
  );
}
