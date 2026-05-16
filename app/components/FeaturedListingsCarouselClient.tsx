"use client";

import Link from "next/link";
import { useRef } from "react";

type Listing = {
  id: string;
  title: string;
  city: string;
  price: number;
  available_from: string;
  available_to: string;
  image_url: string | null;
};

function formatShortRange(fromIso?: string, toIso?: string) {
  const fmt = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");

    return d.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
    });
  };

  return `${fmt(fromIso)} – ${fmt(toIso)}`;
}

export default function FeaturedListingsCarouselClient({
  listings,
}: {
  listings: Listing[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "right" ? 360 : -360,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full overflow-hidden px-5 pb-12">
      <div className="flex items-end justify-between">
        <h2 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900">
          Aktuelle Inserate
        </h2>

        <Link
          href="/results"
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          Alle anzeigen →
        </Link>
      </div>

      <div className="relative mt-4 -mx-4 px-4">

        {/* LEFT BUTTON */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur md:flex"
        >
          ←
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur md:flex"
        >
          →
        </button>

        <div
          ref={scrollRef}
          className="
            mt-4 flex gap-4 overflow-x-auto
            snap-x snap-mandatory
            [-webkit-overflow-scrolling:touch]
            no-scrollbar
          "
        >
          {listings.map((l) => (
            <Link
              key={l.id}
              href={`/listing/${encodeURIComponent(l.id)}`}
              className="
                block min-w-[260px] sm:min-w-[300px] md:min-w-[340px]
                snap-start
                rounded-3xl border border-slate-200 bg-white overflow-hidden
                shadow-sm hover:shadow-md transition
              "
            >
              <div className="h-36 bg-slate-100">
                {l.image_url ? (
                  <img
                    src={l.image_url}
                    alt={l.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                    Bild folgt
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">
                      {l.city}
                    </div>

                    <div className="mt-1 truncate font-semibold text-slate-900">
                      {l.title}
                    </div>

                    <div className="mt-2 text-sm text-slate-600">
                      {formatShortRange(
                        l.available_from,
                        l.available_to
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-xs text-slate-500">
                      Monat
                    </div>

                    <div className="mt-0.5 text-lg font-semibold text-slate-900">
                      {l.price} €
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-slate-50 to-transparent" />
      </div>
    </section>
  );
}