"use client";

import SavedPlans from "@/components/SavedPlans";
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
import React, { useEffect, useState } from "react";

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
    <div className="min-h-screen p-6">
      <CardTitle className="text-3xl font-bold mb-6 px-6">
        Your Profile
      </CardTitle>

      <CardContent className="w-full flex gap-6">
        {/* Left Profile Info */}
        <div className="w-1/4">
          <Card className="max-h-96 p-6 rounded-2xl shadow-md col-span-1">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="profile_picture"
                width={200}
                height={200}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-3 border-gray-500 hover:border-[#a3ea2a] transition duration-300 ease-in-out object-cover cursor-pointer"
                priority
              />
            ) : (
              <UserRound
                className="w-32 h-32 rounded-full mx-auto mb-4 border-3 border-gray-500 hover:border-[#a3ea2a] transition duration-300 ease-in-out"
                strokeWidth={0.3}
                width={100}
                height={100}
              />
            )}
            <div className="text-center">
              <p className="mb-2 text-2xl font-semibold">
                {user?.user_metadata.full_name}
              </p>
              <p className="mb-2 text-muted-foreground flex items-center justify-center gap-2">
                <Mail width={15} height={15} /> {user?.email}
              </p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-2">
                <Calendar width={14} height={14} />
                Member since {stats.memberSince}
              </p>
            </div>

            <Link href="/account-settings">
              <Button
                variant={"main"}
                className={cn("w-full text-gray-800 dark:hover:text-white")}
              >
                Edit Profile
              </Button>
            </Link>
          </Card>

          {/* Quick Stats Card */}
          <Card className="p-6 rounded-2xl shadow-md mt-4">
            <CardTitle className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#a3ea2a]" />
              Quick Stats
            </CardTitle>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Saved Plans
                </span>
                <span className="font-semibold">{stats.totalPlans}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Footprints className="w-4 h-4" />
                  Distnace
                </span>
                <span className="font-semibold">{stats.distanceRun}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Total Hours
                </span>
                <span className="font-semibold">{stats.totalHours}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Saved Results Section */}
        <SavedPlans />
      </CardContent>
    </div>
  );
}
