import Link from "next/link";
import Image from "next/image";
import MetaPill from "./MetaPill";
import { HomeIcon, DoorIcon } from "app/components/icons";

type Props = {
  id: string;
  title: string;
  city: string;
  price: number;
  availableFrom: string;
  availableTo: string;
  href: string;

  distanceKm?: number | null;

  // Du gibst aktuell "Zimmer" oder "Ganze Wohnung" rein
  housingType?: string | null;

  furnished?: boolean | null;
  wifi?: boolean | null;
  imageUrl?: string | null;
};

function formatKm(km?: number | null) {
  if (km === null || km === undefined) return null;
  return `${km.toLocaleString("de-DE", { maximumFractionDigits: 1 })} km`;
}

function isWohnung(housingType?: string | null) {
  return (housingType || "").toLowerCase().includes("wohnung");
}

function CardInner({
  title,
  city,
  price,
  availableFrom,
  availableTo,
  distanceKm,
  housingType,
  furnished,
  wifi,
  imageUrl,
}: Omit<Props, "id" | "href">) {
  const kmLabel = formatKm(distanceKm);
  const wohnung = isWohnung(housingType);

  return (
    <>
      {/* Bildbereich */}
<div className="relative h-36 bg-slate-100 overflow-hidden">
  

  {/* Badge oben rechts */}
 {housingType ? (
  <div className="absolute z-20 top-[10px] right-[10px] left-auto">
    <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 shadow-sm">
      <span className="text-teal-700">
        {wohnung ? <HomeIcon className="h-4 w-4" /> : <DoorIcon className="h-4 w-4" />}
      </span>
      <span className="text-xs font-semibold text-teal-700">
        {wohnung ? "Wohnung" : "Zimmer"}
      </span>
    </div>
  </div>
) : null}

  {/* Bild / Placeholder */}
  {imageUrl ? (
    <Image
      src={imageUrl}
      alt={title}
      width={1200}
      height={800}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
      Bild folgt
    </div>
  )}
</div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm text-slate-500">{city}</div>
            <div className="mt-1 font-semibold text-slate-900 truncate">{title}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-sm text-slate-500">Monat</div>
            <div className="mt-0.5 text-lg font-semibold text-slate-900">{price} €</div>
          </div>
        </div>

        {/* Pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {kmLabel && <MetaPill label={`📍 ${kmLabel} zur Klinik`} />}
          {furnished ? <MetaPill label="🪑 möbliert" /> : null}
          {wifi ? <MetaPill label="📶 WLAN" /> : null}
        </div>

        {/* Datum */}
        <div className="mt-3 text-sm text-slate-600">
          verfügbar{" "}
          <span className="font-medium text-slate-800">{availableFrom}</span> –{" "}
          <span className="font-medium text-slate-800">{availableTo}</span>
        </div>
      </div>
    </>
  );
}

export default function ListingCard(props: Props) {
  const hasValidId =
    typeof props.id === "string" &&
    props.id.trim() !== "" &&
    props.id !== "undefined" &&
    props.id !== "null";

  const baseClass =
    "ms-card relative block overflow-hidden p-0 hover:border-slate-300 hover:shadow-md transition";

  if (!hasValidId) {
    return (
      <div className={`${baseClass} opacity-60 cursor-not-allowed`} aria-disabled="true">
        <CardInner {...props} />
      </div>
    );
  }

  return (
    <Link
      href={props.href}
      className={baseClass}
      aria-label={`Inserat öffnen: ${props.title} in ${props.city}`}
    >
      <CardInner {...props} />
    </Link>
  );
}