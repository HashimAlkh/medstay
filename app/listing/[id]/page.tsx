export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import SiteHeader from "@/app/components/SiteHeader";
import { equipmentMeta } from "@/app/lib/equipmentMeta";
import MetaPill from "@/app/components/MetaPill";
import { equipmentKeys, formatGermanDate, furnishedLabel } from "@/app/lib/listingView";
import ImageGallery from "@/app/components/ImageGallery";

type ListingRow = {
  id: string;
  title: string | null;
  city: string | null;
  price: number | null;
  deposit: number | null;
  available_from: string | null;
  available_to: string | null;
  description: string | null;
  furnished: string | null;
  housing_type: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  email: string | null;
  rooms: number | null;
  size_sqm: number | null;

  equipment: {
    wifi?: boolean;
    washing_machine?: boolean;
    elevator?: boolean;
    parking?: boolean;
    bathroom_type?: string | null;
    kitchen_type?: string | null;
  } | null;
};

function housingTypeLabel(v: string | null) {
  if (v === "apartment") return "Ganze Wohnung";
  if (v === "room") return "Zimmer";
  return "—";
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: listing, error } = await supabaseAdmin
    .from("listings")
    .select(
      [
        "id",
        "title",
        "city",
        "price",
        "deposit",
        "available_from",
        "available_to",
        "description",
        "furnished",
        "housing_type",
        "image_url",
        "image_urls",
        "email",
        "equipment",
        "rooms",
        "size_sqm",
      ].join(",")
    )
    .eq("id", id)
    .single<ListingRow>();

  if (error || !listing) return notFound();

  const eq = listing.equipment || {};

  const badgeKeys = equipmentKeys({
    furnished: listing.furnished,
    housing_type: listing.housing_type,
    wifi: !!eq.wifi,
    washing_machine: !!eq.washing_machine,
    elevator: !!eq.elevator,
    parking: !!eq.parking,
    bathroom_type: eq.bathroom_type,
    kitchen_type: eq.kitchen_type,
  });

  const furnished = furnishedLabel(listing.furnished ?? null) || "—";

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader mode="flow" rightLink={{ href: "/results", label: "Zurück" }} />

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* HERO IMAGE */}
<div className="mb-6">
  {listing.image_urls && listing.image_urls.length > 0 ? (
    <ImageGallery images={listing.image_urls} />
  ) : listing.image_url ? (
    <ImageGallery images={[listing.image_url]} />
  ) : (
    <div className="flex h-56 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-sm text-slate-500 md:h-[300px]">
      Bild folgt
    </div>
  )}
</div>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            {/* LEFT */}
            <div className="min-w-0 sm:basis-[68%]">
              <div className="text-sm text-slate-500">{listing.city}</div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                {listing.title}
              </h1>

              <div className="mt-5 grid gap-2 text-sm text-slate-700">
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
                  <span className="text-slate-500">Zimmer:</span>{" "}
                  {listing.rooms ?? "—"}
                </div>

                <div>
                  <span className="text-slate-500">Größe:</span>{" "}
                  {listing.size_sqm ? `${listing.size_sqm} m²` : "—"}
                </div>
                
              </div>

              <div className="mt-6">
                <div className="text-sm font-medium text-slate-900">
                  Ausstattung
                </div>

                {badgeKeys.length === 0 ? (
                  <div className="mt-2 text-sm text-slate-500">—</div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {badgeKeys.map((key) => {
                      const item = equipmentMeta[key];
                      const Icon = item.icon;

                      return (
                        <MetaPill
                          key={key}
                          label={item.label}
                          icon={<Icon size={12} />}
                          variant="highlight"
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {listing.description ? (
                <div className="mt-6">
                  <div className="text-sm font-medium text-slate-900">
                    Beschreibung
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                    {listing.description}
                  </p>
                </div>
              ) : null}
            </div>

            {/* RIGHT */}
            <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:basis-[32%] sm:shrink-0">
              <div className="text-sm text-slate-500">Preis</div>
              <div className="mt-1 text-3xl font-semibold text-slate-900">
                {listing.price} €
              </div>
              <div className="text-sm text-slate-500">pro Monat</div>
              <div className="mt-2 text-sm text-slate-600">
  Kaution:{" "}
  <span className="font-semibold text-slate-900">
    {listing.deposit ? `${listing.deposit} €` : "—"}
  </span>
</div>
              <div className="my-4 h-px bg-slate-200" />

              {listing.email ? (
                <a
                  href={`mailto:${listing.email}?subject=${encodeURIComponent(
                    `Anfrage zu deinem Medstay-Inserat: ${listing.title || ""}`
                  )}`}
                  className="mt-1 inline-flex w-full items-center justify-center rounded-2xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                >
                  Vermieter kontaktieren
                </a>
              ) : (
                <button
                  disabled
                  className="mt-5 w-full rounded-2xl bg-slate-300 py-3 text-sm font-semibold text-white"
                >
                  Kontakt nicht verfügbar
                </button>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}