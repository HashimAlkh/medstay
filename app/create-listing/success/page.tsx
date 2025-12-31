import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);
  const draftId = pick(sp, "draft");

  if (draftId) {
    // In MVP markieren wir "submitted" – später "paid" via Stripe webhook
    await supabaseAdmin
      .from("listing_drafts")
      .update({ status: "submitted" })
      .eq("id", draftId);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader rightLink={{ href: "/", label: "Startseite" }} />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Vielen Dank!</h1>
        <p className="mt-2 text-slate-600">
          Ihr Inserat wurde übermittelt. Wir prüfen es kurz und veröffentlichen es
          anschließend.
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-6">
          <div className="text-sm text-slate-500">Nächste Schritte</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Prüfung (MVP): kurze Sichtung gegen Spam/Fakes</li>
            <li>• Veröffentlichung: sichtbar für Medizinstudierende</li>
            <li>• Anfragen: Sie erhalten Kontaktanfragen direkt per E-Mail</li>
          </ul>

          <Link
            href="/"
            className="mt-6 block w-full text-center rounded-xl bg-blue-600 text-white py-3 text-sm font-medium hover:bg-blue-700"
          >
            Zur Startseite
          </Link>

          <Link
            href="/create-listing"
            className="mt-3 block w-full text-center rounded-xl border border-slate-300 bg-white py-3 text-sm font-medium hover:bg-slate-50"
          >
            Weiteres Inserat einstellen
          </Link>

          {draftId && (
            <p className="mt-4 text-xs text-slate-500">Draft-ID: {draftId}</p>
          )}
        </div>
      </section>
    </main>
  );
}