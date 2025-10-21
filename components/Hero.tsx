import React from "react";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <h1 className="text-4xl font-bold md:text-6xl mb-4">
        Fuel Smarter. Run Farther.
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        UltraFueling helps endurance athletes master their nutrition — from
        daily meals to race-day fueling strategies.
      </p>
      <div className="flex gap-4">
        <Button size="lg">Try Now</Button>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </div>
    </section>
  );
}
