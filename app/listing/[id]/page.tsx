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
  street: string | null;
  price: number | null;
  deposit: number | null;
  available_from: string | null;
  available_to: string | null;
  description: string | null;
  furnished: string | null;
  housing_type: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  first_name: string | null;
  last_name: string | null;
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
  if (v === "apartment") return "Wohnung";
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
        "street",
        "price",
        "deposit",
        "available_from",
        "available_to",
        "description",
        "furnished",
        "housing_type",
        "image_url",
        "image_urls",
        "first_name",
        "last_name",
        "email",
        "equipment",
        "rooms",
        "size_sqm",
      ].join(",")
    )
    .eq("id", id)
    .eq("status", "active")
    .single<ListingRow>();

  if (error || !listing) return notFound();

  const hostName =
  listing.first_name && listing.last_name
    ? `${listing.first_name} ${listing.last_name.charAt(0)}.`
    : listing.first_name || "Vermieter";

const mailSubject = encodeURIComponent(
  "Interesse an deiner Zwischenmiete über Medstay"
);

const mailBody = encodeURIComponent(`Hallo,

ich interessiere mich für deine Wohnung auf Medstay.

Ich studiere Medizin an der [Universität] und suche für den Zeitraum vom [Datum] bis [Datum] eine Unterkunft im Rahmen von [PJ / Famulatur / Praktikum].

Die Wohnung würde sehr gut passen und ich freue mich über eine Rückmeldung.

Viele Grüße
[Name]`);

  const detailImages =
  listing.image_url && listing.image_urls?.length
    ? [listing.image_url, ...listing.image_urls.filter((url) => url !== listing.image_url)]
    : listing.image_urls?.length
    ? listing.image_urls
    : listing.image_url
    ? [listing.image_url]
    : [];

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
{detailImages.length > 0 ? (
  <ImageGallery images={detailImages} />
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
              {listing.street && (
  <p className="mt-2 text-sm text-slate-600">
    {listing.street}
  </p>
)}

              <div className="mt-5 grid gap-2 text-base text-slate-700">
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
                <div className="text-base font-medium text-slate-900">
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
                  <div className="text-base font-medium text-slate-900">
                    Beschreibung
                  </div>
                  <p className="mt-2 whitespace-pre-line text-base leading-6 text-slate-700">
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
                  href={`mailto:${listing.email}?subject=${mailSubject}&body=${mailBody}`}
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
              <div className="mt-4 text-xs text-slate-500">
                Inseriert von{" "}
                <span className="font-medium text-slate-700">
                  {hostName}
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}