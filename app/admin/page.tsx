export const dynamic = "force-dynamic";
import Link from "next/link";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import { publishDraft, unpublishDraft } from "./actions";


type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

function formatGermanDate(iso?: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);
  const key = pick(sp, "key");

  // MVP-Absicherung: einfacher Key-Check
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="w-full border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              med<span className="text-blue-600">stay</span>
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-2 text-slate-600">
            Zugriff verweigert. Öffne die Seite mit:
          </p>
          <pre className="mt-4 rounded-xl border bg-white p-4 text-sm text-slate-700 overflow-auto">
            /admin?key=DEIN_ADMIN_KEY
          </pre>
          <p className="mt-2 text-xs text-slate-500">
            (MVP) Später ersetzen wir das durch richtigen Login.
          </p>
        </section>
      </main>
    );
  }

  // submitted & published laden (damit du auch zurücknehmen kannst)
  const { data: submitted } = await supabaseAdmin
    .from("listing_drafts")
    .select("id,title,city,price,available_from,available_to,email,status,created_at,housing_type,distance_km,furnished,wifi,kitchen,washing_machine,elevator,basement,image_url")
    .eq("status", "submitted")
    .order("created_at", { ascending: false });

  const { data: published } = await supabaseAdmin
    .from("listing_drafts")
    .select("id,title,city,price,available_from,available_to,email,status,created_at,housing_type,distance_km,furnished,wifi,kitchen,washing_machine,elevator,basement,image_url")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </Link>
          <div className="text-xs text-slate-500">Admin</div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Hier veröffentlichst du eingereichte Inserate (submitted). Link speichern:
          <span className="ml-2 font-mono text-xs">
            /admin?key=****
          </span>
        </p>

        {/* SUBMITTED */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Eingereicht (submitted)</h2>
          <p className="mt-1 text-sm text-slate-600">
            Diese Inserate sind noch nicht sichtbar und warten auf Freigabe.
          </p>

          <div className="mt-4 grid gap-4">
            {(submitted || []).length === 0 ? (
              <div className="ms-card text-sm text-slate-600">
  Keine eingereichten Inserate.
</div>
            ) : (
              (submitted || []).map((l) => (
                <div key={l.id} className="ms-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-slate-500">{l.city}</div>
                      <div className="text-lg font-semibold">{l.title}</div>
                      <div className="mt-2 text-sm text-slate-700">
                        <span className="font-medium">Zeitraum:</span>{" "}
                        {formatGermanDate(l.available_from)} – {formatGermanDate(l.available_to)}
                      </div>
                      <div className="mt-1 text-sm text-slate-700">
                        <span className="font-medium">Preis:</span> {l.price} € / Monat
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Kontakt: {l.email}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        ID: {l.id}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[180px]">
                      <form action={publishDraft.bind(null, l.id)}>
  <button type="submit" className="ms-btn-primary">
    Veröffentlichen
  </button>
</form>

                      <Link
  className="ms-btn-secondary block text-center"
  href={`/create-listing/preview?draft=${encodeURIComponent(l.id)}`}
>
  Vorschau ansehen
</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PUBLISHED */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold">Veröffentlicht (published)</h2>
          <p className="mt-1 text-sm text-slate-600">
            Diese Inserate sind (bald) auf der Results-Seite sichtbar.
          </p>

          <div className="mt-4 grid gap-4">
            {(published || []).length === 0 ? (
              <div className="ms-card">
                Noch keine veröffentlichten Inserate.
              </div>
            ) : (
              (published || []).map((l) => (
                <div key={l.id} className="ms-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-slate-500">{l.city}</div>
                      <div className="text-lg font-semibold">{l.title}</div>
                      <div className="mt-2 text-sm text-slate-700">
                        {formatGermanDate(l.available_from)} – {formatGermanDate(l.available_to)}
                      </div>
                      <div className="mt-1 text-sm text-slate-700">{l.price} € / Monat</div>
                      <div className="mt-1 text-xs text-slate-400">ID: {l.id}</div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[180px]">
                      <form action={unpublishDraft.bind(null, l.id)}>
  <button type="submit" className="ms-btn-danger">
  Zurückziehen
</button>
</form>
                      <Link
                        className="ms-btn-secondary block text-center"
                        href={`/create-listing/preview?draft=${encodeURIComponent(l.id)}`}
                      >
                        Vorschau ansehen
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}