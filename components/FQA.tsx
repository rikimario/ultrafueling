import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function FQA() {
  return (
    <section id="faq" className="relative py-20 max-w-5xl mx-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-[#0080ff11] blur-3xl rounded-full" />
      </div>
      <div className="text-center my-10 space-y-4">
        <h1 className="font-bold text-4xl">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-center text-xl max-w-2xl mx-auto">
          Everything you need to know about using UltraFueling - simplified and
          transparent.
        </p>
      </div>

      {/* Accordion */}
      <div className="max-w-2xl mx-auto">
        {/* Item 1 */}
        <Accordion type="single" collapsible className={cn("w-full space-y-4")}>
          <AccordionItem
            value="item-1"
            className={cn("border border-[#2b3b55]/95 px-2 rounded-xl")}
          >
            <AccordionTrigger className={cn("text-lg")}>
              What is UltraFueling?
            </AccordionTrigger>
            <AccordionContent className={cn("text-base text-muted-foreground")}>
              <p>
                UltraFueling is a data-driven fueling calculator that helps
                endurance athletes plan exactly how much carbs, fluids, and
                electrolytes to take during training and races-based on
                duration, intensity, terrain, and conditions.
              </p>
            </AccordionContent>
          </AccordionItem>
          {/* Item 2 */}
          <AccordionItem
            value="item-2"
            className={cn("border border-[#2b3b55]/95 px-2 rounded-xl")}
          >
            <AccordionTrigger className={cn("text-lg")}>
              Who is UltraFueling for?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              <p>
                UltraFueling is built for: Marathon & ultra runners Trail and
                mountain athletes Cyclists and triathletes Anyone racing longer
                than ~90 minutes If fueling mistakes cost you performance or
                cause GI issues, UltraFueling is for you.
              </p>
            </AccordionContent>
          </AccordionItem>
          {/* Item 3 */}
          <AccordionItem
            value="item-3"
            className={cn("border border-[#2b3b55]/95 px-2 rounded-xl")}
          >
            <AccordionTrigger className={cn("text-lg")}>
              How is this different from “1 gel per hour”?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              <p>
                Most advice ignores: Body weight Heat & elevation Carb tolerance
                Sweat rate UltraFueling uses evidence-based ranges and adapts
                fueling hour-by-hour instead of guessing.
              </p>
            </AccordionContent>
          </AccordionItem>
          {/* Item 4 */}
          <AccordionItem
            value="item-4"
            className={cn("border border-[#2b3b55]/95 px-2 rounded-xl")}
          >
            <AccordionTrigger className={cn("text-lg")}>
              Is the free calculator enough?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              <p>
                The free calculator is great for: Quick estimates Shorter events
                First-time users The paid version unlocks: Full fueling plans
                Hour-by-hour breakdowns Saved plans PDF exports
              </p>
            </AccordionContent>
          </AccordionItem>
          {/* Item 5 */}
          <AccordionItem
            value="item-5"
            className={cn("border border-[#2b3b55]/95 px-2 rounded-xl")}
          >
            <AccordionTrigger className={cn("text-lg")}>
              Is this science-based?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              <p>
                Yes. UltraFueling is built on: Sports nutrition research
                Endurance fueling guidelines Real-world race fueling strategies
                No gimmicks, no supplements to sell.
              </p>
            </AccordionContent>
          </AccordionItem>
          {/* Item 6 */}
          <AccordionItem
            value="item-6"
            className={cn("border border-[#2b3b55]/95 px-2 rounded-xl")}
          >
            <AccordionTrigger className={cn("text-lg")}>
              Can I cancel my subscription anytime?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              <p>
                Yes. You can cancel at any time from your account. You&rsquo;ll
                keep access until the end of your billing period-no hidden fees.
              </p>
            </AccordionContent>
          </AccordionItem>
          {/* Item 7 */}
          <AccordionItem
            value="item-7"
            className={cn("border border-[#2b3b55]/95 px-2 rounded-xl")}
          >
            <AccordionTrigger className={cn("text-lg")}>
              Will this work for trail & ultra races?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              <p>
                Absolutely. UltraFueling accounts for: Long durations Elevation
                changes Variable pacing Heat and cold conditions It&rsquo;s
                designed for non-flat, non-predictable races.
              </p>
            </AccordionContent>
          </AccordionItem>
          {/* Item 8 */}
          <AccordionItem
            value="item-8"
            className={cn("border border-[#2b3b55]/95 px-2 rounded-xl")}
          >
            <AccordionTrigger className={cn("text-lg")}>
              Do I need special products or brands?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-6">
              <p>
                No. UltraFueling gives you numbers, not brands. You can use
                gels, drinks, real food-whatever works for you.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
