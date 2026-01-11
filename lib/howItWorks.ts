import { Calculator, ChartGantt, SquareChartGantt } from "lucide-react";

export const data = [
  {
    step: "01",
    title: "Enter Your Race Details",
    description:
      "Distance, duration, terrain, weather, and your body stats. No guessing, no complicated setup.",
    icon: SquareChartGantt,
    className:
      "lg:-translate-x-80 xl:-translate-x-85 lg:rotate-[-6deg] lg:w-[320px] w-full lg:p-4 p-2 lg:z-10 text-center",
  },
  {
    step: "02",
    title: "We Calculate Your Fueling Plan",
    description:
      "Our algorithm adapts calories, carbs, fluids, and sodium based on effort, terrain, and conditions.",
    icon: Calculator,
    className:
      "lg:-translate-y-5 xl:-translate-y-5 lg:w-[340px] w-full lg:p-5 p-2 lg:z-20 text-center",
  },
  {
    step: "03",
    title: "Execute With Confidence",
    description:
      "Get a clear, hour-by-hour fueling plan you can follow during training or race day.",
    icon: ChartGantt,
    className:
      "lg:translate-x-80 xl:translate-x-85 lg:rotate-[6deg] lg:w-[320px] w-full lg:p-4 px-2 lg:z-10 text-center",
  },
];
