import { cn } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Calculator, SquareChartGantt } from "lucide-react";

export default function HowItWorks() {
  return (
    <>
      <div className="text-center pt-20 pb-10 space-y-4">
        <h1 className="font-bold text-4xl">How It Works</h1>
        <p className="text-muted-foreground text-center text-xl max-w-2xl mx-auto">
          UltraFueling turns your race details into a personalized fueling
          strategy - so you know exactly what to eat and drink, and when.
        </p>
      </div>
      <section className="relative flex justify-center item-center h-[500px] py-4 overflwow-hidden">
        {/* Glow Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#0080ff11] blur-3xl"></span>
        </div>

        {/* Cards */}

        <div className="relative flex justify-center items-center">
          <Card
            className={cn(
              "absolute w-[320px] -translate-x-85 rotate-[-6deg] flex flex-col items-center p-6"
            )}
          >
            {/* Decorative top line */}
            <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />
            <span className="text-2xl font-bold text-[#99CCFF] text-shadow-[0_0px_20px_#99CCFF]">
              01
            </span>
            <CardTitle className={cn("text-2xl font-bold")}>
              Enter Your Race Details
            </CardTitle>
            <CardDescription className={cn("text-md")}>
              Distance, duration, terrain, weather, and your body stats. No
              guessing, no complicated setup.
            </CardDescription>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-form-icon lucide-form text-[#99CCFF]"
            >
              <path d="M4 14h6" />
              <path d="M4 2h10" />
              <rect x="4" y="18" width="16" height="4" rx="1" />
              <rect x="4" y="6" width="16" height="4" rx="1" />
            </svg>
          </Card>
          <Card
            className={cn(
              "absolute w-[340px] -translate-y-5 flex flex-col items-center p-5 z-10"
            )}
          >
            {/* Decorative top line */}
            <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />
            <span className="text-2xl font-bold text-[#99CCFF] text-shadow-[0_0px_20px_#99CCFF]">
              02
            </span>
            <CardTitle className={cn("text-2xl font-bold")}>
              We Calculate Your Fueling Plan
            </CardTitle>
            <CardDescription className={cn("text-md")}>
              Our algorithm adapts calories, carbs, fluids, and sodium based on
              effort, terrain, and conditions.
            </CardDescription>

            <Calculator
              strokeWidth={0.5}
              className="w-32 h-32 text-[#99CCFF]"
            />
          </Card>
          <Card
            className={cn(
              "absolute w-[320px] translate-x-85 rotate-[6deg] flex flex-col items-center p-4 z-20"
            )}
          >
            {/* Decorative top line */}
            <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />
            <span className="text-2xl font-bold text-[#99CCFF] text-shadow-[0_0px_20px_#99CCFF]">
              03
            </span>
            <CardTitle className={cn("text-2xl font-bold")}>
              Execute With Confidence
            </CardTitle>
            <CardDescription className={cn("text-md")}>
              Get a clear, hour-by-hour fueling plan you can follow during
              training or race day.
            </CardDescription>
            <SquareChartGantt
              strokeWidth={0.5}
              className="w-32 h-32 text-[#99CCFF]"
            />
          </Card>
        </div>
      </section>
    </>
  );
}
