export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import {
  equipmentList,
  formatGermanDate,
  distanceLabelKm,
  furnishedLabel,
} from "@/app/lib/listingView";
import { submitDraft } from "./actions";

type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

function housingTypeLabel(v: string | null) {
  if (v === "apartment") return "Ganze Wohnung";
  if (v === "room") return "Zimmer";
  return "—";
}

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);
  const draftId = pick(sp, "draft");
  const submitted = pick(sp, "submitted") === "1";

  if (!draftId) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="w-full border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              med<span className="text-blue-600">stay</span>
            </Link>
            <Link
              href="/create-listing/form"
              className="text-sm text-slate-600 hover:text-black"
            >
              Inserat erstellen
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Vorschau</h1>
          <p className="mt-2 text-slate-600">Kein Draft angegeben.</p>
          <p className="mt-3 text-sm text-slate-600">
            Öffne die Seite mit{" "}
            <span className="font-mono">?draft=DEINE_ID</span>.
          </p>
        </section>
      </main>
    );
  }

  const { data: draft, error } = await supabaseAdmin
    .from("listing_drafts")
    .select(
      "id,title,city,price,available_from,available_to,description,email,status,created_at,housing_type,distance_km,furnished,wifi,kitchen,washing_machine,elevator,basement,image_url"
    )
    .eq("id", draftId)
    .single();

  if (error || !draft) {
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
          <h1 className="text-2xl font-semibold tracking-tight">Vorschau</h1>
          <p className="mt-2 text-slate-600">Draft nicht gefunden.</p>
          <p className="mt-3 text-xs text-slate-500">{error?.message}</p>
        </section>
      </main>
    );
  }

  const badges = equipmentList({
    furnished: draft.furnished,
    housing_type: draft.housing_type,
    wifi: draft.wifi,
    kitchen: draft.kitchen,
    washing_machine: draft.washing_machine,
    elevator: draft.elevator,
    basement: draft.basement,
  });

  const furnished = furnishedLabel(draft.furnished ?? null) || "—";
  const distance = distanceLabelKm(draft.distance_km ?? null) || "—";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/create-listing/form"
              className="text-sm text-slate-600 hover:text-black"
            >
              Neues Inserat
            </Link>
            <Link
              href="/results"
              className="text-sm text-slate-600 hover:text-black"
            >
              Zu Treffern
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Vorschau</h1>
            <p className="mt-2 text-sm text-slate-600">
              Diese Ansicht zeigt dir, was gespeichert wurde. (Draft:{" "}
              <span className="font-mono text-xs">{draft.id}</span>)
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Status:{" "}
            <span className="font-medium text-slate-700">{draft.status}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[2fr,1fr]">
          {/* Links: Preview Card */}
          <div className="rounded-2xl border bg-white p-5">
            <div className="h-44 rounded-xl bg-slate-100 mb-4 flex items-center justify-center text-slate-500 text-sm">
              Bild-Platzhalter
            </div>

            <div className="text-sm text-slate-500">{draft.city}</div>
            <div className="mt-1 text-xl font-semibold">{draft.title}</div>

            <div className="mt-3 grid gap-2">
              <div className="text-sm text-slate-700">
                <span className="text-slate-500">Zeitraum:</span>{" "}
                {formatGermanDate(draft.available_from)} –{" "}
                {formatGermanDate(draft.available_to)}
              </div>

              <div className="text-sm text-slate-700">
                <span className="text-slate-500">Wohnungstyp:</span>{" "}
                {housingTypeLabel(draft.housing_type)}
              </div>

              <div className="text-sm text-slate-700">
                <span className="text-slate-500">Entfernung:</span> {distance}
              </div>

              <div className="text-sm text-slate-700">
                <span className="text-slate-500">Möblierung:</span> {furnished}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium text-slate-900">
                Ausstattung
              </div>
              {badges.length === 0 ? (
                <div className="mt-2 text-sm text-slate-600">—</div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {draft.description ? (
              <div className="mt-4">
                <div className="text-sm font-medium text-slate-900">
                  Beschreibung
                </div>
                <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">
                  {draft.description}
                </p>
              </div>
            ) : null}
          </div>

          {/* Rechts: Preis + Submit */}
          <div className="rounded-2xl border bg-white p-5 h-fit">
            <div className="text-sm text-slate-500">Preis</div>
            <div className="text-2xl font-semibold mt-1">{draft.price} €</div>
            <div className="text-xs text-slate-500 mt-1">pro Monat</div>

            <div className="my-4 h-px bg-slate-200" />

            <div className="text-sm font-medium text-slate-900">Kontakt</div>
            <div className="mt-2 text-sm text-slate-700">
              {draft.email ? draft.email : "—"}
            </div>

            <div className="mt-5">
              {draft.status === "draft" ? (
                <form action={submitDraft} className="space-y-2">
                  <input type="hidden" name="draft_id" value={draft.id} />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700"
                  >
                    Inserat einreichen
                  </button>
                  <p className="text-xs text-slate-500">
                    Nach dem Einreichen prüfst du es im Admin-Dashboard und
                    veröffentlichst es.
                  </p>
                </form>
              ) : (
                <div className="rounded-xl border bg-slate-50 p-3 text-sm text-slate-700">
                  Status:{" "}
                  <span className="font-medium">{draft.status}</span>
                </div>
              )}

              {submitted ? (
                <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800 text-center">
  Danke! Dein Inserat wurde eingereicht ✅  <br/>
  Wir prüfen es kurz und schalten es anschließend frei.
</div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}