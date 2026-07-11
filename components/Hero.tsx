"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import GlassQuickStats from "./GlassQuickStats";
import GlassSavedPlans from "./GlassSavedPlans";
import GlassHourlyPlan from "./GlassHourlyPlan";
import { usePathname, useRouter } from "next/navigation";
import { scrollToSection } from "@/utils/small-functions/scrollToSection";

export default function Hero() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <section className="relative flex items-center justify-between gap-20 py-16 text-center md:px-6">
      <div className="flex w-full flex-col items-center">
        <h1 className="mb-4 text-5xl font-bold md:text-[5.5rem]">
          Fuel Smarter. <br />{" "}
          <span className="bg-emerald-500 bg-clip-text text-transparent">
            Run Farther.
          </span>
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl text-lg">
          UltraFueling helps endurance athletes master their nutrition - from
          daily meals to race-day fueling strategies.
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => scrollToSection("freeCalc", pathname, router)}
            variant={"main"}
            size="xxl"
          >
            Try Now
          </Button>
          <Button
            onClick={() => scrollToSection("howItWorks", pathname, router)}
            variant="secondary"
            size={"xxl"}
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Right Side*/}

      <div className="relative hidden h-[520px] w-full xl:block">
        {/* Decorative background */}
        <span className="absolute top-10 right-20 -z-10 h-72 w-72 rounded-full bg-[#0080ff11] blur-3xl" />
        <span className="absolute bottom-20 left-10 -z-10 h-96 w-96 rounded-full bg-[#0080ff11] blur-3xl" />

        {/* Glass Rings */}
        <span className="absolute top-0 left-0 h-96 w-96 rounded-full border border-white/5 backdrop-blur-sm" />
        <span className="absolute right-0 bottom-0 h-96 w-96 rounded-full border border-white/5 backdrop-blur-sm" />

        {/* Floating particles */}
        <span className="absolute top-10 right-48 h-2 w-2 animate-pulse rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
        <span className="absolute bottom-10 left-40 h-2 w-2 animate-pulse rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
        <span className="absolute top-72 right-24 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
        <span className="absolute top-32 left-48 h-1 w-1 animate-pulse rounded-full bg-white/50" />

        {/* Quick Stats – top right */}
        <div
          className="animate-float-rotate absolute top-0 right-0"
          style={
            { "--rotate": "3deg", animationDelay: "0s" } as React.CSSProperties
          }
        >
          <GlassQuickStats />
        </div>

        {/* Saved Plans – middle left */}
        <div
          className="animate-float-rotate absolute top-[190px] left-0"
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
          className="animate-float-rotate absolute top-[280px] right-0 z-50"
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
