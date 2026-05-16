import Link from "next/link";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import FeaturedListingsCarouselClient from "./FeaturedListingsCarouselClient";

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
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  };
  return `${fmt(fromIso)} – ${fmt(toIso)}`;
}

export default async function FeaturedListingsCarousel() {
  const { data, error } = await supabaseAdmin
  .from("listings")
  .select("id,title,city,price,available_from,available_to,image_url,published_at")
  .order("published_at", { ascending: false })
  .limit(10);

  if (error) {
    // leise failen: Startseite soll nie crashen
    console.error("FeaturedListingsCarousel error:", error.message);
    return null;
  }

  const listings = (data ?? []) as Listing[];
  if (listings.length === 0) return null;

return <FeaturedListingsCarouselClient listings={listings} />;
}