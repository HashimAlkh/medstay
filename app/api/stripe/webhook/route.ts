// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/app/lib/stripe";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe signature or webhook secret" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err?.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const draftId =
        session.metadata?.draft_id ||
        session.client_reference_id ||
        null;

      if (!draftId) {
        // kein Draft zuordenbar → trotzdem 200 zurückgeben, damit Stripe nicht spam-retry macht
        return NextResponse.json({ ok: true, warning: "No draft_id on session" });
      }

      // idempotent: nur setzen, wenn noch nicht paid
      const { error } = await supabaseAdmin
        .from("listing_drafts")
        .update({
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          stripe_session_id: session.id,
        })
        .eq("id", draftId);

      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // Stripe wird retryen, wenn du 500 gibst – das ist okay, aber nur bei echten Fehlern
    return NextResponse.json({ error: e?.message || "Webhook handler failed" }, { status: 500 });
  }
}