import Link from "next/link";
import MetaPill from "./MetaPill";

type Props = {
  id: string;
  title: string;
  city: string;
  price: number;
  availableFrom: string;
  availableTo: string;
  href: string;

  // v2 meta
  distanceKm?: number | null;
  housingType?: string | null;
  furnished?: boolean | null;
  wifi?: boolean | null;

  imageUrl?: string | null;
};

function formatKm(km?: number | null) {
  if (km === null || km === undefined) return null;
  // 0.8 -> "0,8 km"
  return `${km.toLocaleString("de-DE", { maximumFractionDigits: 1 })} km`;
}

export default function ListingCard({
  id,
  title,
  city,
  price,
  availableFrom,
  availableTo,
  href,
  distanceKm,
  housingType,
  furnished,
  wifi,
  imageUrl,
}: Props) {
  const kmLabel = formatKm(distanceKm);

  return (
    <Link
      href={href}
      className="ms-card block overflow-hidden p-0 hover:border-slate-300 hover:shadow-md transition"
      aria-label={`Inserat öffnen: ${title} in ${city}`}
    >
      {/* Bild */}
      <div className="h-36 bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
            Bild folgt
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Head */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm text-slate-500">{city}</div>
            <div className="mt-1 font-semibold text-slate-900 truncate">
              {title}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-sm text-slate-500">Monat</div>
            <div className="mt-0.5 text-lg font-semibold text-slate-900">
              {price} €
            </div>
          </div>
        </div>

        {/* Meta pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {kmLabel && <MetaPill label={`📍 ${kmLabel} zur Klinik`} />}
          {housingType && <MetaPill label={`🏠 ${housingType}`} />}
          {furnished ? <MetaPill label="🪑 möbliert" /> : null}
          {wifi ? <MetaPill label="📶 WLAN" /> : null}
        </div>

        {/* Dates */}
        <div className="mt-3 text-sm text-slate-600">
          verfügbar{" "}
          <span className="font-medium text-slate-800">{availableFrom}</span> –{" "}
          <span className="font-medium text-slate-800">{availableTo}</span>
        </div>
      </div>
    </Link>
  );
}