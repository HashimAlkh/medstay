export const dynamic = "force-dynamic";

import Link from "next/link";
import Stripe from "stripe";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { LISTING_FEE_EUR } from "@/app/lib/pricing";

type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);
  const draftId = pick(sp, "draft");
  const sessionId = pick(sp, "session_id");

  if (!draftId || !sessionId) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-semibold tracking-tight">Zahlung</h1>
          <p className="mt-2 text-slate-600">Fehlende Parameter.</p>
          <p className="mt-3 text-xs text-slate-500">
            draft und session_id müssen vorhanden sein.
          </p>
          <Link href="/" className="mt-6 inline-block text-sm text-blue-600">
            Zur Startseite
          </Link>
        </section>
      </main>
    );
  }

  // 1) Session verifizieren
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-semibold tracking-tight">Zahlung nicht abgeschlossen</h1>
          <p className="mt-2 text-slate-600">
            Deine Zahlung ist noch nicht bestätigt. Bitte versuche es erneut.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href={`/pay?draft=${encodeURIComponent(draftId)}`}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Zur Zahlung
            </Link>
            <Link
              href={`/create-listing/preview?draft=${encodeURIComponent(draftId)}`}
              className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Zur Vorschau
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Optional: Betrag prüfen (MVP-Schutz)
  const amountTotal = session.amount_total ?? 0;
  const expected = Math.round(LISTING_FEE_EUR * 100);
  if (amountTotal && amountTotal !== expected) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-semibold tracking-tight">Zahlung geprüft</h1>
          <p className="mt-2 text-slate-600">
            Betrag stimmt nicht mit der Inseratsgebühr überein.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            amount_total={amountTotal} erwartet={expected}
          </p>
        </section>
      </main>
    );
  }

  // 2) Draft updaten: paid + automatisch submitted (idempotent)
  const { error } = await supabaseAdmin
    .from("listing_drafts")
    .update({
      payment_status: "paid",
      paid_at: new Date().toISOString(),
      status: "submitted",
      stripe_session_id: session.id, // wenn Spalte fehlt: entfernen oder Spalte anlegen
    })
    .eq("id", draftId);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-semibold tracking-tight">Danke! Zahlung eingegangen ✅</h1>
          <p className="mt-2 text-slate-600">
            Wir konnten dein Inserat aber nicht automatisch einreichen.
          </p>
          <p className="mt-3 text-xs text-slate-500">{error.message}</p>
          <Link
            href={`/create-listing/preview?draft=${encodeURIComponent(draftId)}`}
            className="mt-6 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Zur Vorschau
          </Link>
        </section>
      </main>
    );
  }

  // 3) Neue Success UI (kein Preview-Look)
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </Link>
          <div className="text-xs text-slate-500">Zahlung</div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border bg-white p-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Danke! Deine Zahlung ist eingegangen ✅
          </h1>

          <p className="mt-3 text-slate-700">
            Dein Inserat wurde eingereicht und wird jetzt kurz geprüft.
            <br />
            Danach schalten wir es frei.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/results"
              className="w-full sm:w-auto text-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Entdecke Wohnungen für dein nächstes Praktikum
            </Link>

            <Link
              href={`/create-listing/preview?draft=${encodeURIComponent(draftId)}&submitted=1`}
              className="w-full sm:w-auto text-center rounded-xl border bg-white px-5 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Vorschau ansehen
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Referenz: <span className="font-mono">{draftId}</span>
          </p>
        </div>
      </section>
    </main>
  );
}