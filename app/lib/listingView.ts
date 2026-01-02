import type { Furnished, ListingDraft } from "./listingTypes";

export function formatGermanDate(iso?: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

export function furnishedLabel(v: Furnished | null) {
  if (v === "yes") return "möbliert";
  if (v === "partial") return "teilmöbliert";
  if (v === "no") return "unmöbliert";
  return null;
}

export function distanceLabelKm(km: number | null) {
  if (km == null) return null;
  return `${km.toLocaleString("de-DE", { maximumFractionDigits: 1 })} km zur Klinik/Uni`;
}

export function equipmentList(l: Pick<
  ListingDraft,
  "wifi" | "kitchen" | "washing_machine" | "elevator" | "basement" | "furnished" | "housing_type"
>) {
  const out: string[] = [];

  const f = furnishedLabel(l.furnished ?? null);
  if (f) out.push(f);

  if (l.housing_type) out.push(l.housing_type);

  if (l.wifi) out.push("WLAN");
  if (l.kitchen) out.push("Küche");
  if (l.washing_machine) out.push("Waschmaschine");
  if (l.elevator) out.push("Aufzug");
  if (l.basement) out.push("Keller");

  return out;
}