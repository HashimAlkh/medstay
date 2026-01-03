"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createDraft(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const price = Number(formData.get("price") || 0);
  const available_from = String(formData.get("from") || "");
  const available_to = String(formData.get("to") || "");
  const description = String(formData.get("description") || "").trim();
  const email = String(formData.get("email") || "").trim();

  const housing_type = String(formData.get("housing_type") || "").trim() || null;
  const furnished = String(formData.get("furnished") || "").trim() || null;

  // "1,2" -> 1.2
  const distanceRaw = String(formData.get("distance_km") || "").trim();
  const distance_km = distanceRaw ? Number(distanceRaw.replace(",", ".")) : null;

  const wifi = formData.get("wifi") === "on";
  const kitchen = formData.get("kitchen") === "on";
  const washing_machine = formData.get("washing_machine") === "on";
  const elevator = formData.get("elevator") === "on";
  const basement = formData.get("basement") === "on";

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
        housing_type,
        furnished,
        distance_km,
        wifi,
        kitchen,
        washing_machine,
        elevator,
        basement,
        status: "draft",
      },
    ])
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Draft konnte nicht gespeichert werden");
  }

  redirect(`/create-listing/preview?draft=${data.id}`);
}