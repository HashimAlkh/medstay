export function formatGermanDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

// ✅ zurückgebracht für Kompatibilität (wird später aus den Pages entfernt)
export function distanceLabelKm(km: number | null | undefined) {
  if (km === null || km === undefined) return "";
  if (Number.isNaN(Number(km))) return "";
  return `${Number(km).toLocaleString("de-DE", { maximumFractionDigits: 1 })} km`;
}

export function furnishedLabel(v: string | null) {
  if (!v) return "";
  if (v === "yes") return "möbliert";
  if (v === "no") return "unmöbliert";
  return "";
}

type EquipmentInput = {
  furnished?: string | null;
  housing_type?: string | null;

  wifi?: boolean;
  washing_machine?: boolean;
  elevator?: boolean;
  parking?: boolean;

  bathroom_type?: "private" | "shared" | string | null;
  kitchen_type?: "private" | "shared" | string | null;
};

export function equipmentList(e: EquipmentInput) {
  const out: string[] = [];

  if (e.wifi) out.push("WLAN");
  if (e.washing_machine) out.push("Waschmaschine");
  if (e.elevator) out.push("Aufzug");
  if (e.parking) out.push("Parkplatz");

  if (e.bathroom_type === "private") out.push("eigenes Bad");
  else if (e.bathroom_type === "shared") out.push("gemeinsames Bad");

  if (e.kitchen_type === "private") out.push("eigene Küche");
  else if (e.kitchen_type === "shared") out.push("gemeinsame Küche");

  return out;
}