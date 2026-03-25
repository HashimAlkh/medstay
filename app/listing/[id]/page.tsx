export const dynamic = "force-dynamic";

import Image from "next/image";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import SiteHeader from "@/app/components/SiteHeader";
import { equipmentMeta } from "@/app/lib/equipmentMeta";
import MetaPill from "@/app/components/MetaPill";
import { equipmentKeys, formatGermanDate, furnishedLabel } from "@/app/lib/listingView";

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
  image_url: string | null;

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
        "available_from",
        "available_to",
        "description",
        "furnished",
        "housing_type",
        "image_url",
        "equipment",
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
  const leftBadges = badgeKeys.slice(0, 3);
const rightBadges = badgeKeys.slice(3, 6);
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader mode="flow" rightLink={{ href: "/results", label: "Zurück" }} />

      {/* HERO IMAGE */}
      <div className="mx-auto max-w-5xl px-4 mt-8">
  <div className="relative h-[240px] md:h-[340px] rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
          {listing.image_url ? (
            <Image src={listing.image_url} alt="" fill className="object-cover" />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Bild folgt
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-4 py-8 grid gap-6 lg:grid-cols-[1.65fr,0.95fr]">

        {/* LEFT */}
        <div className="space-y-5">

          {/* TITLE BLOCK */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-500">{listing.city}</div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-2 text-slate-900">
               {listing.title}
            </h1>

            <div className="mt-4 grid gap-2 text-sm text-slate-700">
              <div>
                <span className="text-slate-500">Zeitraum:</span>{" "}
                {formatGermanDate(listing.available_from)} –{" "}
                {formatGermanDate(listing.available_to)}
              </div>

              <div>
                <span className="text-slate-500">Typ:</span>{" "}
                {housingTypeLabel(listing.housing_type)}
              </div>

              <div>
                <span className="text-slate-500">Möblierung:</span> {furnished}
              </div>


              
            </div>
          </div>

          {/* EQUIPMENT */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-900 mb-2">
              Ausstattung
            </div>

            <div className="flex gap-6">
              {badgeKeys.length === 0 ? (
  <span className="text-sm text-slate-500">—</span>
) : (
  <>
    <div className="flex flex-col gap-2">
      {leftBadges.map((key) => {
        const item = equipmentMeta[key];
        const Icon = item.icon;

        return (
  <MetaPill
    key={key}
    label={item.label}
    icon={<Icon size={14} />}
    variant="highlight"
  />
);
      })}
    </div>

    <div className="flex flex-col gap-2">
      {rightBadges.map((key) => {
        const item = equipmentMeta[key];
        const Icon = item.icon;

        return (
  <MetaPill
    key={key}
    label={item.label}
    icon={<Icon size={14} />}
    variant="highlight"
  />
);
      })}
    </div>
  </>
)}
            </div>
          </div>

          {/* DESCRIPTION */}
          {listing.description && (
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm">
              <div className="text-sm font-medium text-slate-900">
                Beschreibung
              </div>
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <aside className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm h-fit sticky top-24">
          <div className="text-sm text-slate-500">Preis</div>
          <div className="text-3xl font-semibold mt-1">
            {listing.price} €
          </div>
          <div className="text-xs text-slate-500">pro Monat</div>

          <div className="my-4 h-px bg-slate-200" />

          <div className="text-sm font-medium text-slate-900">Kontakt</div>
          <p className="mt-2 text-sm text-slate-600">
            Erst nach Anfrage sichtbar
          </p>

          <button className="mt-5 w-full rounded-2xl bg-teal-500 text-white py-3 text-sm font-medium hover:bg-teal-600 transition shadow-sm">
            Kontakt anfragen
          </button>
        </aside>
      </section>
    </main>
  );
}