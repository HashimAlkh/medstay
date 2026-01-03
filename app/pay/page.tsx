export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { LISTING_FEE_EUR } from "@/app/lib/pricing";
import { redirect } from "next/navigation";

type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function markPaid(formData: FormData) {
  "use server";

  const draftId = String(formData.get("draft_id") || "").trim();
  const key = String(formData.get("key") || "").trim();

  if (!draftId) redirect("/pay?reason=missing_draft");

  // Admin-Check
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    redirect(`/pay?draft=${encodeURIComponent(draftId)}&reason=forbidden`);
  }

  await supabaseAdmin
    .from("listing_drafts")
    .update({ paid_at: new Date().toISOString(), payment_status: "paid" })
    .eq("id", draftId);

  redirect(`/create-listing/preview?draft=${encodeURIComponent(draftId)}&paid=1`);
}

export default async function PayPage({ searchParams }: { searchParams: SP | Promise<SP> }) {
  const sp = await Promise.resolve(searchParams);
  const draftId = pick(sp, "draft");
  const reason = pick(sp, "reason");
  const key = pick(sp, "key");

  if (!draftId) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-semibold">Zahlung</h1>
          <p className="mt-2 text-slate-600">Kein Draft angegeben.</p>
          <Link className="mt-4 inline-block text-blue-600" href="/">
            Zur Startseite
          </Link>
        </div>
      </main>
    );
  }

  const { data: draft } = await supabaseAdmin
    .from("listing_drafts")
    .select("id,title,city,price,status,paid_at,payment_status")
    .eq("id", draftId)
    .single();

  const isAdmin = process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </Link>
          <Link href={`/create-listing/preview?draft=${encodeURIComponent(draftId)}`} className="text-sm text-slate-600 hover:text-black">
            Zurück zur Vorschau
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Zahlung</h1>

        {reason === "unpaid" ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Dein Inserat kann erst eingereicht werden, wenn die Zahlung erfolgt ist.
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border bg-white p-5">
          <div className="text-sm text-slate-500">Inserat</div>
          <div className="mt-1 text-lg font-semibold">{draft?.title || "—"}</div>
          <div className="text-sm text-slate-600">{draft?.city || "—"}</div>

          <div className="mt-4 text-sm text-slate-700">
            Preis für Veröffentlichung: <span className="font-semibold">{LISTING_FEE_EUR} €</span>
          </div>

          <div className="mt-4 rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">
            (MVP) Stripe kommt als nächster Schritt. Hier ist nur der Platzhalter-Funnel.
          </div>

          {draft?.paid_at ? (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              Zahlung: bezahlt ✅
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
              Zahlung: offen
            </div>
          )}

          {isAdmin ? (
  <form className="mt-4" action={markPaid}>
    <input type="hidden" name="draft_id" value={draftId} />
    <input type="hidden" name="key" value={key} />
    <button className="w-full rounded-xl bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700">
      (Admin) Als bezahlt markieren
    </button>
    <p className="mt-2 text-xs text-slate-500">
      Nur für Tests. Später ersetzt durch Stripe Webhook.
    </p>
  </form>
) : (
  <p className="mt-4 text-xs text-slate-500">
    (MVP) Zahlung folgt. Für Tests: /pay?draft=...&key=DEIN_ADMIN_KEY
  </p>
)}
        </div>
      </section>
    </main>
  );
}