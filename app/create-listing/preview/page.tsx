import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

function formatGermanDate(iso?: string) {
  if (!iso) return "—";
  // date kommt aus supabase als 'YYYY-MM-DD'
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);
  const draftId = pick(sp, "draft");

  // 1) DraftId fehlt
  if (!draftId) {
    return (
      <main className="min-h-screen bg-slate-50">
        <SiteHeader rightLink={{ href: "/create-listing/form", label: "Zum Formular" }} />
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Vorschau</h1>
          <p className="mt-2 text-slate-600">
            Kein Draft in der URL gefunden. Bitte Formular erneut absenden.
          </p>
        </section>
      </main>
    );
  }

  // 2) Draft aus Supabase laden
  const { data, error } = await supabaseAdmin
    .from("listing_drafts")
    .select("*")
    .eq("id", draftId)
    .maybeSingle();

  // 3) Debug-Box (zeigt IMMER was Sache ist)
  const debug = {
    draftId,
    hasData: Boolean(data),
    error: error?.message || null,
  };

  // 4) Draft nicht gefunden / Fehler
  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-50">
        <SiteHeader rightLink={{ href: "/create-listing/form", label: "Zum Formular" }} />
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Vorschau</h1>
          <p className="mt-2 text-slate-600">
            Draft konnte nicht geladen werden. Das liegt meistens an einer falschen Draft-ID
            oder daran, dass der Eintrag nicht gespeichert wurde.
          </p>

          <div className="mt-6 rounded-2xl border bg-white p-4">
            <div className="text-sm font-medium">Debug</div>
            <pre className="mt-2 text-xs text-slate-600 whitespace-pre-wrap">
              {JSON.stringify(debug, null, 2)}
            </pre>
          </div>

          <Link
            href="/create-listing/form"
            className="mt-6 inline-block rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
          >
            Zurück zum Formular
          </Link>
        </section>
      </main>
    );
  }

  // 5) Happy Path
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader rightLink={{ href: "/create-listing/form", label: "Bearbeiten" }} />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Vorschau</h1>
        <p className="mt-2 text-slate-600">
          Prüfen Sie Ihr Inserat. Wenn alles passt, geht es zur Bezahlung.
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-6">
          <div className="text-sm text-slate-500">{data.city}</div>
          <div className="mt-1 text-xl font-semibold">{data.title}</div>

          <div className="mt-3 text-sm text-slate-700">
            <span className="font-medium">Zeitraum:</span>{" "}
            {formatGermanDate(data.available_from)} – {formatGermanDate(data.available_to)}
          </div>

          <div className="mt-2 text-sm text-slate-700">
            <span className="font-medium">Preis:</span> {data.price} € / Monat
          </div>

          <div className="mt-4 text-sm text-slate-700 whitespace-pre-wrap">
            {data.description}
          </div>

          <div className="mt-4 text-sm text-slate-700">
            <span className="font-medium">Kontakt:</span> {data.email}
          </div>
        </div>

        <Link
          href={`/create-listing/pay?draft=${encodeURIComponent(draftId)}`}
          className="mt-6 block w-full text-center rounded-xl bg-blue-600 text-white py-3 text-sm font-medium hover:bg-blue-700"
        >
          Zur Bezahlung (19 €)
        </Link>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <div className="text-sm font-medium">Debug</div>
          <pre className="mt-2 text-xs text-slate-600 whitespace-pre-wrap">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}