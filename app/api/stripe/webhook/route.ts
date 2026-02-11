export const runtime = "nodejs";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(err.message, { status: 400 });
  }

  const supabase = supabaseAdmin;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.subscription || !session.metadata?.userId) {
          return NextResponse.json({ ok: true });
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );

        const userId = session.metadata.userId;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const { data, error } = await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            subscription_plan: subscription.items.data[0].price.id,
            subscription_status: subscription.status,
            trial_ends_at: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          })
          .eq("id", userId);

        if (error) {
          console.error("❌ Database update error:", error);
        } else {
          console.log("✅ Database updated successfully!", data);
        }

        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;

        const { data, error } = await supabase
          .from("profiles")
          .update({
            subscription_status: sub.status,
            subscription_plan: sub.items.data[0].price.id,
            trial_ends_at: sub.trial_end
              ? new Date(sub.trial_end * 1000).toISOString()
              : null,
          })
          .eq("stripe_subscription_id", sub.id);

        if (error) {
          console.error("❌ Database update error:", error);
        } else {
          console.log("✅ Subscription updated!", data);
        }

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        await supabase
          .from("profiles")
          .update({
            subscription_status: "canceled",
            subscription_plan: null,
            stripe_subscription_id: null,
          })
          .eq("stripe_subscription_id", sub.id);

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        const line = invoice.lines.data[0];
        if (!line?.subscription) {
          break;
        }

        const subscriptionId =
          typeof line.subscription === "string"
            ? line.subscription
            : line.subscription.id;

        const { data, error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
          })
          .eq("stripe_subscription_id", subscriptionId);

        if (error) {
          console.error("❌ Database update error:", error);
        } else {
          console.log("✅ Set to active!", data);
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const line = invoice.lines.data[0];
        if (!line?.subscription) break;

        const subscriptionId =
          typeof line.subscription === "string"
            ? line.subscription
            : line.subscription.id;

        await supabase
          .from("profiles")
          .update({
            subscription_status: "past_due",
          })
          .eq("stripe_subscription_id", subscriptionId);

        break;
      }

      default:
        console.log("⚪ Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("💥 Webhook handler error:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
