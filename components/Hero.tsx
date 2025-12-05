"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function Hero() {
  const { isDark } = useDarkMode();

  if (isDark === null) return null;

  return (
    <section className="flex items-center justify-between text-center py-16 px-6">
      <div className="flex flex-col items-center">
        <h1 className="relative text-3xl font-semibold md:text-9xl mb-4">
          <span className="absolute inset-0 -z-10 m-auto h-[420px] w-[620px] rounded-full bg-emerald-400/20 blur-3xl"></span>
          Fuel Smarter. <br />{" "}
          <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
            Run Farther.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          UltraFueling helps endurance athletes master their nutrition - from
          daily meals to race-day fueling strategies.
        </p>
        <div className="flex gap-4">
          <Button variant={"main"} size="xxl">
            Try Now
          </Button>
          <Button variant="secondary" size={"xxl"}>
            Learn More
          </Button>
        </div>
      </div>

      {/* Right Side*/}

      <div className="relative w-[400px] h-[500px]">
        <Image
          key={isDark ? "dark" : "light"}
          className=" rounded-2xl transform-gpu transform-3d shadow-xl shadow-emerald-500/30 oobject-cover"
          src={isDark ? "/advanced-calc.png" : "/advanced-calc-light.png"}
          alt="calculator-preview"
          sizes="(max-width: 768px) 100vw, 400px"
          priority
          fill
          quality={100}
        />
      </div>
    </section>
  );
}
