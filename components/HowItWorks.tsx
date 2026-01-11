import { cn } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { data } from "@/lib/howItWorks";

export default function HowItWorks() {
  return (
    <>
      <div id="howItWorks" className="text-center pt-20 pb-10 space-y-4">
        <h1 className="font-bold text-4xl">How It Works</h1>
        <p className="text-muted-foreground text-center text-xl max-w-2xl mx-auto">
          UltraFueling turns your race details into a personalized fueling
          strategy - so you know exactly what to eat and drink, and when.
        </p>
      </div>
      <section className="relative flex px-8 flex-col lg:flex-row gap-6 lg:gap-0 justify-center item-center lg:h-[500px] py-4 overflwow-hidden">
        {/* Glow Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#0080ff11] blur-3xl"></span>
        </div>

        {/* Cards */}

        <div className="relative flex flex-col md:px-32 lg:flex-row gap-6 justify-center items-center">
          {data.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className={cn(
                  "relative lg:absolute flex flex-col items-center",
                  item.className
                )}
              >
                {/* Decorative top line */}
                <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />
                <span className="text-2xl font-bold text-[#99CCFF] text-shadow-[0_0px_20px_#99CCFF]">
                  {item.step}
                </span>
                <CardTitle className={cn("text-2xl font-bold")}>
                  {item.title}
                </CardTitle>
                <CardDescription className={cn("text-md")}>
                  {item.description}
                </CardDescription>

                <Icon strokeWidth={0.5} className="w-32 h-32 text-[#99CCFF]" />
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
