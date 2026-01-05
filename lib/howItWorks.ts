import { Calculator, ChartGantt, SquareChartGantt } from "lucide-react";

export const data = [
  {
    step: "01",
    title: "Enter Your Race Details",
    description:
      "Distance, duration, terrain, weather, and your body stats. No guessing, no complicated setup.",
    icon: SquareChartGantt,
    className: "-translate-x-85 rotate-[-6deg] w-[320px] p-4 z-10",
  },
  {
    step: "02",
    title: "We Calculate Your Fueling Plan",
    description:
      "Our algorithm adapts calories, carbs, fluids, and sodium based on effort, terrain, and conditions.",
    icon: Calculator,
    className: "-translate-y-5 w-[340px] p-5 z-20",
  },
  {
    step: "03",
    title: "Execute With Confidence",
    description:
      "Get a clear, hour-by-hour fueling plan you can follow during training or race day.",
    icon: ChartGantt,
    className: "translate-x-85 rotate-[6deg] w-[320px] p-4 z-10",
  },
];
