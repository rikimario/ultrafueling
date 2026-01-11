"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import GlassQuickStats from "./GlassQuickStats";
import GlassSavedPlans from "./GlassSavedPlans";
import GlassHourlyPlan from "./GlassHourlyPlan";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-between text-center py-16 md:px-6 gap-20">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-5xl font-bold md:text-8xl mb-4">
          Fuel Smarter. <br />{" "}
          <span className="bg-emerald-500 bg-clip-text text-transparent">
            Run Farther.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          UltraFueling helps endurance athletes master their nutrition - from
          daily meals to race-day fueling strategies.
        </p>
        <div className="flex gap-4">
          <Link href={"#freeCalc"}>
            <Button variant={"main"} size="xxl">
              Try Now
            </Button>
          </Link>
          <Link href={"#howItWorks"}>
            <Button variant="secondary" size={"xxl"}>
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Side*/}

      <div className="hidden xl:block relative w-full h-[520px]">
        {/* Decorative background */}
        <span className="absolute -z-10 top-10 right-20 w-72 h-72 rounded-full bg-[#0080ff11] blur-3xl" />
        <span className="absolute -z-10 bottom-20 left-10 w-96 h-96 rounded-full bg-[#0080ff11] blur-3xl" />

        {/* Glass Rings */}
        <span className="absolute top-0 left-0 w-96 h-96 rounded-full border border-white/5 backdrop-blur-sm" />
        <span className="absolute bottom-0 right-0 w-96 h-96 rounded-full border border-white/5 backdrop-blur-sm" />

        {/* Floating particles */}
        <span className="absolute top-10 right-48 w-2 h-2 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-pulse" />
        <span className="absolute bottom-10 left-40 w-2 h-2 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-pulse" />
        <span className="absolute top-72 right-24 w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse" />
        <span className="absolute top-32 left-48 w-1 h-1 rounded-full bg-white/50 animate-pulse" />

        {/* Quick Stats – top right */}
        <div
          className="absolute top-0 right-0 animate-float-rotate"
          style={
            { "--rotate": "3deg", animationDelay: "0s" } as React.CSSProperties
          }
        >
          <GlassQuickStats />
        </div>

        {/* Saved Plans – middle left */}
        <div
          className="absolute top-[190px] left-0 animate-float-rotate"
          style={
            {
              "--rotate": "-2deg",
              animationDelay: "0.4s",
            } as React.CSSProperties
          }
        >
          <GlassSavedPlans />
        </div>

        {/* Hourly Plan – bottom left */}
        <div
          className="absolute top-[280px] right-0 animate-float-rotate z-50"
          style={
            {
              "--rotate": "3deg",
              animationDelay: "0.8s",
            } as React.CSSProperties
          }
        >
          <GlassHourlyPlan />
        </div>
      </div>
    </section>
  );
}
