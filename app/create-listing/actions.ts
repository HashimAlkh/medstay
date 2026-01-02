"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function pick(fd: FormData, key: string) {
  return (fd.get(key)?.toString() || "").trim();
}

function pickBool(fd: FormData, key: string) {
  // checkbox -> "on" wenn gesetzt
  return fd.get(key) === "on";
}

function pickNumber(fd: FormData, key: string) {
  // akzeptiert "600", "600.50", "600,50"
  const raw = pick(fd, key);
  if (!raw) return null;
  const normalized = raw.replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function pickFurnished(fd: FormData) {
  const v = pick(fd, "furnished");
  if (v === "yes" || v === "partial" || v === "no") return v;
  return null;
}

export async function createDraft(formData: FormData) {
  // existing
  const title = pick(formData, "title");
  const city = pick(formData, "city");
  const price = pickNumber(formData, "price") ?? 0;

  const available_from = pick(formData, "from"); // YYYY-MM-DD
  const available_to = pick(formData, "to");     // YYYY-MM-DD

  const description = pick(formData, "description");
  const email = pick(formData, "email");

  // new fields (schema)
  const housing_type = pick(formData, "housing_type") || null;
  const distance_km = pickNumber(formData, "distance_km"); // null allowed
  const furnished = pickFurnished(formData);

  const wifi = pickBool(formData, "wifi");
  const kitchen = pickBool(formData, "kitchen");
  const washing_machine = pickBool(formData, "washing_machine");
  const elevator = pickBool(formData, "elevator");
  const basement = pickBool(formData, "basement");

  const { data, error } = await supabase
    .from("listing_drafts")
    .insert([
      {
        title,
        city,
        price,
        available_from,
        available_to,
        description,
        email,

        // NEW
        housing_type,
        distance_km,
        furnished,
        wifi,
        kitchen,
        washing_machine,
        elevator,
        basement,
      },
    ])
    .select("id")
    .single();

  if (error || !data) {
    // hilfreichere Fehlermeldung (Supabase error text)
    throw new Error(error?.message || "Draft konnte nicht gespeichert werden");
  }

  redirect(`/create-listing/preview?draft=${data.id}`);
}