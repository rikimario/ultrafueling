import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY as string;

export const stripe = new Stripe(key, {
  apiVersion: "2025-09-30.clover",
  typescript: true,
});
