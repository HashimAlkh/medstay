import Link from "next/link";

type ListingCardProps = {
  id: string;
  title: string;
  city: string;
  price: number;
  availableFrom: string;
  availableTo: string;
  href: string;
};

export default function ListingCard({
  id,
  title,
  city,
  price,
  availableFrom,
  availableTo,
  href,
}: ListingCardProps) {
  return (
    <Link
      href={href}
      className="listing-card block rounded-2xl border bg-white p-4 hover:shadow-sm transition"
      aria-label={`Inserat ansehen: ${title} (${city})`}
    >
      <div className="text-sm text-slate-500">{city}</div>
      <div className="font-semibold">{title}</div>
      <div className="mt-2 text-sm text-slate-600">
        verfügbar {availableFrom} – {availableTo}
      </div>
      <div className="mt-2 font-semibold">{price} € / Monat</div>
    </Link>
  );
}