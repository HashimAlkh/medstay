export const dynamic = "force-dynamic";

import type React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { equipmentList, formatGermanDate, furnishedLabel } from "@/app/lib/listingView";

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

function bathroomLabel(v: string | null) {
  if (v === "private") return "eigenes Bad";
  if (v === "shared") return "gemeinsames Bad";
  return "—";
}

function kitchenLabel(v: string | null) {
  if (v === "private") return "eigene Küche";
  if (v === "shared") return "gemeinsame Küche";
  return "—";
}

type ListingRow = {
  id: string;
  title: string | null;
  city: string | null;
  price: number | null;
  available_from: string | null;
  available_to: string | null;
  description: string | null;
  furnished: string | null;
  housing_type: string | null;

  // ✅ neue Felder
  wifi: boolean | null;
  washing_machine: boolean | null;
  elevator: boolean | null;
  parking: boolean | null;
  bathroom_type: string | null; // private/shared
  kitchen_type: string | null;  // private/shared

  image_url: string | null;
};

export default async function ListingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SP | Promise<SP>;
}) {
  const { id } = await params;
  const sp = await Promise.resolve(searchParams);
  const fromResults = pick(sp, "from") === "results";

  // Falls du in "listings" speicherst: dort laden.
  // Du hast schon /listing/[id] im Projekt, also gehe ich davon aus:
  // Tabelle: "listings" mit id = listing id (UUID)
  const { data: listing, error } = await supabaseAdmin
    .from("listings")
    .select(
      [
        "id",
        "title",
        "city",
        "price",
        "available_from",
        "available_to",
        "description",
        "furnished",
        "housing_type",
        "wifi",
        "washing_machine",
        "elevator",
        "parking",
        "bathroom_type",
        "kitchen_type",
        "image_url",
      ].join(",")
    )
    .eq("id", id)
    .single<ListingRow>();

  if (error || !listing) return notFound();

  const badges = equipmentList({
    furnished: listing.furnished,
    housing_type: listing.housing_type,
    wifi: !!listing.wifi,
    washing_machine: !!listing.washing_machine,
    elevator: !!listing.elevator,
    parking: !!listing.parking,
    bathroom_type: listing.bathroom_type,
    kitchen_type: listing.kitchen_type,
  });

  const furnished = furnishedLabel(listing.furnished ?? null) || "—";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="font-semibold text-slate-900">medstay</div>

          <a
            href={fromResults ? "/results" : "/"}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Zurück
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          {/* Left: Media + Content */}
          <div className="rounded-2xl border bg-white overflow-hidden">
            <div className="relative h-64 bg-slate-100">
              {listing.image_url ? (
                <Image
                  src={listing.image_url}
                  alt={listing.title ?? "Inserat"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm text-slate-500">
                  Bild folgt
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="text-sm text-slate-500">{listing.city}</div>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                {listing.title ?? "—"}
              </h1>

              <div className="mt-4 grid gap-2 text-sm text-slate-700">
                <div>
                  <span className="text-slate-500">Zeitraum:</span>{" "}
                  {formatGermanDate(listing.available_from)} –{" "}
                  {formatGermanDate(listing.available_to)}
                </div>

                <div>
                  <span className="text-slate-500">Wohnungstyp:</span>{" "}
                  {housingTypeLabel(listing.housing_type)}
                </div>

                <div>
                  <span className="text-slate-500">Möblierung:</span> {furnished}
                </div>

                <div>
                  <span className="text-slate-500">Bad:</span>{" "}
                  {bathroomLabel(listing.bathroom_type)}
                </div>

                <div>
                  <span className="text-slate-500">Küche:</span>{" "}
                  {kitchenLabel(listing.kitchen_type)}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm font-medium text-slate-900">Ausstattung</div>
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

              {listing.description ? (
                <div className="mt-5">
                  <div className="text-sm font-medium text-slate-900">Beschreibung</div>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                    {listing.description}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right: Price card */}
          <aside className="rounded-2xl border bg-white p-5 h-fit">
            <div className="text-sm text-slate-500">Preis</div>
            <div className="mt-1 text-3xl font-semibold text-slate-900">
              {listing.price ?? "—"} €
            </div>
            <div className="mt-1 text-xs text-slate-500">pro Monat</div>

            <div className="my-4 h-px bg-slate-200" />

            <div className="text-sm font-medium text-slate-900">Kontakt</div>
            <div className="mt-2 text-sm text-slate-700">
              Aus Datenschutzgründen erst nach Kontaktanfrage sichtbar.
            </div>

            <button className="mt-5 w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-black">
              Kontakt anfragen
            </button>

            <p className="mt-3 text-xs text-slate-500">
              MVP: Kontaktfluss kommt als nächstes.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}