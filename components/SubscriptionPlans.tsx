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

const plans = [
  {
    name: "monthly",
    priceId: process.env.STRIPE_PRICE_ID1,
    price: 9,
    duration: "/month",
  },
  {
    name: "yearly",
    priceId: process.env.STRIPE_PRICE_ID2,
    price: 79,
    duration: "/year",
  },
];

export default async function SubscriptionPlans() {
  const user = await getUser();
  return (
    <section className="flex items-center justify-center gap-4 my-12">
      {plans.map((plan, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>${plan.price}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <span>Unlimited access to all features</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <SubscribeBtn
              priceId={plan.priceId ?? ""}
              userId={user?.id ?? ""}
            />
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
