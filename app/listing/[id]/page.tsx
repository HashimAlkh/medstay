export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import {
  equipmentList,
  formatGermanDate,
  distanceLabelKm,
  furnishedLabel,
} from "@/app/lib/listingView";

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

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);

  // ✅ params in Next 16 kann Promise sein
  const { id: rawId } = await params;
  const id = (rawId || "").trim();


  // Debug-Backlink Parameter (optional)
  const city = pick(sp, "city");
  const from = pick(sp, "from");
  const to = pick(sp, "to");

  const backHref =
    `/results?city=${encodeURIComponent(city)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  // ✅ harte Guards gegen "undefined" / leere ID
  if (!id || id === "undefined" || id === "null") {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="w-full border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              med<span className="text-blue-600">stay</span>
            </Link>
            <Link href={backHref} className="text-sm text-slate-600 hover:text-black">
              Zurück zu Treffern
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Detailseite – Fehler</h1>
          <p className="mt-2 text-slate-600">ID ist leer/ungültig.</p>
          <p className="mt-3 text-xs text-slate-500">Debug: rawId = "{rawId}"</p>
        </section>
      </main>
    );
  }

  // ✅ Nur veröffentlichte Inserate dürfen angezeigt werden
  const { data: listing, error } = await supabaseAdmin
    .from("listing_drafts")
    .select(
      "id,title,city,price,available_from,available_to,description,email,status,housing_type,distance_km,furnished,wifi,kitchen,washing_machine,elevator,basement,image_url"
    )
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="w-full border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              med<span className="text-blue-600">stay</span>
            </Link>
            <Link href={backHref} className="text-sm text-slate-600 hover:text-black">
              Zurück zu Treffern
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Inserat</h1>
          <p className="mt-2 text-slate-600">Inserat nicht gefunden oder nicht veröffentlicht.</p>
          {error?.message ? (
            <p className="mt-3 text-xs text-slate-500">{error.message}</p>
          ) : null}
          <p className="mt-3 text-xs text-slate-400">ID: {id}</p>
        </section>
      </main>
    );
  }

  const badges = equipmentList({
    furnished: listing.furnished ?? null,
    housing_type: listing.housing_type ?? null,
    wifi: listing.wifi ?? false,
    kitchen: listing.kitchen ?? false,
    washing_machine: listing.washing_machine ?? false,
    elevator: listing.elevator ?? false,
    basement: listing.basement ?? false,
  });

  const furnished = furnishedLabel(listing.furnished ?? null) || "—";
  const distance = distanceLabelKm(listing.distance_km ?? null) || "—";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </Link>
          <Link href={backHref} className="text-sm text-slate-600 hover:text-black">
            Zurück zu Treffern
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">{listing.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{listing.city}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-[2fr,1fr]">
          {/* Links */}
          <div className="rounded-2xl border bg-white p-5">
            <div className="h-56 rounded-xl bg-slate-100 overflow-hidden">
              {listing.image_url ? (
                <Image
                  src={listing.image_url}
                  alt={listing.title}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm text-slate-500">
                  Bild folgt
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-2 text-sm text-slate-700">
              <div>
                <span className="text-slate-500">Zeitraum:</span>{" "}
                {formatGermanDate(listing.available_from)} – {formatGermanDate(listing.available_to)}
              </div>
              <div>
                <span className="text-slate-500">Wohnungstyp:</span>{" "}
                {housingTypeLabel(listing.housing_type ?? null)}
              </div>
              <div>
                <span className="text-slate-500">Entfernung:</span> {distance}
              </div>
              <div>
                <span className="text-slate-500">Möblierung:</span> {furnished}
              </div>
            </div>

            <div className="mt-4">
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
              <div className="mt-4">
                <div className="text-sm font-medium text-slate-900">Beschreibung</div>
                <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            ) : null}
          </div>

          {/* Rechts */}
          <div className="rounded-2xl border bg-white p-5 h-fit">
            <div className="text-sm text-slate-500">Preis</div>
            <div className="text-2xl font-semibold mt-1">{listing.price} €</div>
            <div className="text-xs text-slate-500 mt-1">pro Monat</div>

            <div className="my-4 h-px bg-slate-200" />

            <div className="text-sm font-medium text-slate-900">Kontakt</div>
            <div className="mt-2 text-sm text-slate-700">{listing.email || "—"}</div>

            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700"
            >
              Kontakt anfragen (Demo)
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}