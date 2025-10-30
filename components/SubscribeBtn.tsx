"use client";

import React from "react";
import { Button } from "./ui/button";
import { subscribeAction } from "@/app/get-started/stripe";

type Props = {
  priceId: string;
  userId: string;
};

export default function SubscribeBtn({ priceId, userId }: Props) {
  const handleSubscribe = async () => {
    try {
      const { url } = await subscribeAction({ priceId, userId });
      window.location.href = url;
    } catch (err) {
      console.error("❌ Checkout error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <Button onClick={handleSubscribe}>Subscribe</Button>
    </div>
  );
}
