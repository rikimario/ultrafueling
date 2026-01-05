import { Crown, Sparkles, Zap } from "lucide-react";

export const Plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    priceId: "",
    price: 0,
    duration: "",
    featurese: [
      "Basic fueling calcurator",
      "Standard recommendations",
      "Email support",
      "Standard recommendations",
    ],
    popular: false,
    icon: Zap,
  },
  {
    name: "Monthly",
    description: "Best for regular training",
    priceId: process.env.STRIPE_PRICE_ID1,
    price: 9,
    duration: "/month",
    featurese: [
      "Unlimited fueling plans",
      "Hour-by-hour breakdown",
      "Terrain + temperature adjustments",
      "AI-generated fueling notes",
      "Save plans",
      "Export plans as PDF",
    ],
    popular: true,
    icon: Sparkles,
  },
  {
    name: "Yearly",
    description: "Save 27% annually",
    priceId: process.env.STRIPE_PRICE_ID2,
    price: 79,
    duration: "/year",
    featurese: [
      "Unlimited fueling plans",
      "Hour-by-hour breakdown",
      "Terrain + temperature adjustments",
      "AI-generated fueling notes",
      "Save plans",
      "Export plans as PDF",
      "Save 29$ vs monthly",
    ],
    popular: false,
    icon: Crown,
  },
];
