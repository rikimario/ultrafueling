"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { subscribeAction } from "@/app/get-started/stripe";
import { cn } from "@/lib/utils";

type Props = {
  priceId: string;
  userId: string;
  planName: string;
  popular: boolean;
};

export default function SubscribeBtn({
  priceId,
  userId,
  planName,
  popular,
}: Props) {
  if (planName === "Free") {
    return (
      <div className="w-full">
        <Link href="/#freeCalc">
          <Button
            variant="secondary"
            className={cn("w-full border-[#2b3b55]/95 hover:bg-[#2b3b55]/20")}
          >
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubscribe = async () => {
    try {
      if (!priceId) return;

      const { url } = await subscribeAction({ priceId, userId });
      window.location.href = url;
    } catch (err) {
      console.error("❌ Checkout error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Button
      variant={popular ? "default" : "secondary"}
      className={cn("w-full border-[#2b3b55]/95 hover:bg-[#2b3b55]/20")}
      onClick={handleSubscribe}
    >
      Subscribe
    </Button>
  );
}
