import Link from "next/link";
import Image from "next/image";
import MetaPill from "./MetaPill";
console.log("✅ USING ListingCard from app/components/ListingCard.tsx");

type Props = {
  id: string;
  title: string;
  city: string;
  price: number;
  availableFrom: string;
  availableTo: string;
  href: string;

  distanceKm?: number | null;
  housingType?: string | null;
  furnished?: boolean | null;
  wifi?: boolean | null;
  imageUrl?: string | null;
};

function formatKm(km?: number | null) {
  if (km === null || km === undefined) return null;
  return `${km.toLocaleString("de-DE", { maximumFractionDigits: 1 })} km`;
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

  return (
    <>
      <div className="h-36 bg-slate-100">
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

      <div className="p-4">
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

        <div className="mt-3 flex flex-wrap gap-2">
          {kmLabel && <MetaPill label={`📍 ${kmLabel} zur Klinik`} />}
          {housingType && <MetaPill label={`🏠 ${housingType}`} />}
          {furnished ? <MetaPill label="🪑 möbliert" /> : null}
          {wifi ? <MetaPill label="📶 WLAN" /> : null}
        </div>

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
    "ms-card block overflow-hidden p-0 hover:border-slate-300 hover:shadow-md transition";

  // ✅ Wenn ID kaputt: kein Link, kein Crash, kein “/listing/undefined”
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