"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  priceId: string;
  userId: string;
};

export async function subscribeAction({
  priceId,
  userId,
}: Props): Promise<{ url: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (!user) throw new Error("Not logged in");

  if (!user) redirect("/get-started");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: user.email ?? undefined,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    metadata: {
      userId: userId,
      email: user.email || "",
    },
  });

  if (!session?.url) throw new Error("Failed to create checkout session");

  return { url: session.url };
}
