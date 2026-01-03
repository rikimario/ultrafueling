import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import SubscribeBtn from "./SubscribeBtn";
import getUser from "@/utils/supabase/user";
import { cn } from "@/lib/utils";
import { Check, Crown, Sparkles, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    priceId: "",
    price: 0,
    duration: "",
    featurese: [
      "Basic fueling calcurator",
      "Standard recommendations",
      "Email support",
      "Standard recommendations",
    ],
    popular: false,
    icon: <Zap className="w-6 h-6" />,
  },
  {
    name: "Monthly",
    description: "Best for regular training",
    priceId: process.env.STRIPE_PRICE_ID1,
    price: 9,
    duration: "/month",
    featurese: [
      "Unlimited fueling plans",
      "Hour-by-hour breakdown",
      "Terrain + temperature adjustments",
      "AI-generated fueling notes",
      "Save plans",
      "Export plans as PDF",
    ],
    popular: true,
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    name: "Yearly",
    description: "Save 27% annually",
    priceId: process.env.STRIPE_PRICE_ID2,
    price: 79,
    duration: "/year",
    featurese: [
      "Unlimited fueling plans",
      "Hour-by-hour breakdown",
      "Terrain + temperature adjustments",
      "AI-generated fueling notes",
      "Save plans",
      "Export plans as PDF",
      "Save 29$ vs monthly",
    ],
    popular: false,
    icon: <Crown className="w-6 h-6" />,
  },
];

export default async function SubscriptionPlans() {
  const user = await getUser();
  return (
    <section id="subcribe" className="relative gap-4 py-20 max-w-5xl mx-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-[#0080ff11] blur-3xl rounded-full" />
      </div>
      <div className="text-center my-10 space-y-4">
        <h1 className="font-bold text-4xl">Choose your plan</h1>
        <p className="text-muted-foreground text-center text-xl max-w-2xl mx-auto">
          Unlock your full potential with personalized nutrition plans tailored
          to your training goals.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-6">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={cn(
              "flex flex-col relative hover:shadow-[#66b3ff]/95 border-1 border-[#2b3b55]/95 hover:border-[#66b3ff]/95 hover:translate-y-[-4px] transition-all duration-300 ease-in-out",
              plan.popular && "border-1 border-[#66b3ff]/95"
            )}
          >
            {/* Decorative top line */}
            <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />
            {/* Most Popular */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 text-xs font-semibold text-gray-900 rounded-full bg-gradient-to-r from-[#a4e534] to-[#8acb1a]">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className={cn("text-center pb-2")}>
              <div className="mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/20">
                {plan.icon}
              </div>
              <CardTitle className={cn("text-2xl font-bold")}>
                {plan.name}
              </CardTitle>
              <CardDescription className={cn("text-muted-foreground")}>
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className={cn("flex-1 flex flex-col")}>
              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">{plan.duration}</span>
              </div>
              {/* Features */}
              <ul className="space-y-3 mb-6 flex-1">
                {plan.featurese.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <CardFooter>
                <SubscribeBtn
                  priceId={plan.priceId ?? ""}
                  userId={user?.id ?? ""}
                  planName={plan.name}
                  popular={plan.popular}
                />
              </CardFooter>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
