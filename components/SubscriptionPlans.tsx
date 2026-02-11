"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import SubscribeBtn from "./SubscribeBtn";
// import getUser from "@/utils/supabase/user";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Plans } from "@/lib/subPlans";
import { createClient } from "@/utils/supabase/server";
import { useProfile } from "@/hooks/useProfile";

export default function SubscriptionPlans() {
  const { profile, loading } = useProfile();

  if (loading) return null;
  // const user = await getUser();
  // let profile = null;

  // // Fetch profile data for button states
  // if (user) {
  //   const supabase = await createClient();
  //   const { data } = await supabase
  //     .from("profiles")
  //     .select("subscription_status, subscription_plan, trial_ends_at")
  //     .eq("id", user.id)
  //     .single();
  //   profile = data;
  // }
  return (
    <section id="subscribe" className="relative mx-auto max-w-5xl gap-4 py-20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-[#0080ff11] blur-3xl" />
      </div>
      <div className="my-10 space-y-4 text-center">
        <h1 className="text-4xl font-bold">Choose your plan</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-center text-xl">
          Unlock your full potential with personalized nutrition plans tailored
          to your training goals.
        </p>
      </div>
      <div className="grid grid-cols-1 justify-center gap-4 md:grid-cols-3 lg:gap-6 lg:px-6">
        {Plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <Card
              key={index}
              className={cn(
                "relative flex flex-col border-1 border-[#2b3b55]/95 transition-all duration-300 ease-in-out hover:translate-y-[-4px] hover:border-[#66b3ff]/95 hover:shadow-[#66b3ff]/95",
                plan.popular && "border-1 border-[#66b3ff]/95",
              )}
            >
              {/* Decorative top line */}
              <span className="to-transparent] absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF]" />
              {/* Most Popular */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-[#a4e534] to-[#8acb1a] px-4 py-1 text-xs font-semibold text-gray-900">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className={cn("pb-2 text-center")}>
                <div className="bg-primary/20 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className={cn("text-2xl font-bold")}>
                  {plan.name}
                </CardTitle>
                <CardDescription className={cn("text-muted-foreground")}>
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className={cn("flex flex-1 flex-col")}>
                {/* Price */}
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">{plan.duration}</span>
                </div>
                {/* Features */}
                <ul className="mb-6 flex-1 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="bg-primary/20 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <CardFooter>
                  <SubscribeBtn
                    key={plan.name}
                    priceId={plan.priceId}
                    profile={profile}
                    popular={plan.popular}
                    trialDays={plan.trialDays}
                    isTrial={plan.isTrial}
                    loading={loading}
                  />
                </CardFooter>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
