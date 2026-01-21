"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type DraftRow = {
  id: string;
  title: string | null;
  city: string | null;
  price: number | null;
  available_from: string | null;
  available_to: string | null;
  furnished: string | null;
  description: string | null;
  email: string | null;
  image_url: string | null;
  wifi: boolean | null;
  kitchen: boolean | null;
  washing_machine: boolean | null;
  elevator: boolean | null;
  basement: boolean | null;
  housing_type: string | null;
  distance_km: number | null;
  status: string | null;
};

// Equipment aus Draft-Flags bauen
function buildEquipment(draft: DraftRow) {
  return {
    wifi: !!draft.wifi,
    kitchen: !!draft.kitchen,
    washing_machine: !!draft.washing_machine,
    elevator: !!draft.elevator,
    basement: !!draft.basement,
    housing_type: draft.housing_type ?? null,
    distance_km: draft.distance_km ?? null,
  };
}

function adminRedirect() {
  return redirect(`/admin?key=${encodeURIComponent(process.env.ADMIN_KEY || "")}`);
}

export async function publishDraft(draftId: string) {
  // 1) Draft laden
  const { data: draft, error: fetchErr } = await supabase
    .from("listing_drafts")
    .select(
      "id,title,city,price,available_from,available_to,furnished,description,email,image_url,wifi,kitchen,washing_machine,elevator,basement,housing_type,distance_km,status"
    )
    .eq("id", draftId)
    .single<DraftRow>();

  if (fetchErr || !draft) {
    throw new Error(fetchErr?.message || "Draft nicht gefunden");
  }

  const nowIso = new Date().toISOString();

  // 2) In listings upserten (ACHTUNG: draft_id muss UNIQUE sein für onConflict)
  const { error: upsertErr } = await supabase
    .from("listings")
    .upsert(
      {
        draft_id: draft.id,
        title: draft.title,
        city: draft.city,
        price: draft.price,
        available_from: draft.available_from,
        available_to: draft.available_to,
        furnished: draft.furnished,
        description: draft.description,
        email: draft.email,
        image_url: draft.image_url,
        equipment: buildEquipment(draft),
        published_at: nowIso,
      },
      { onConflict: "draft_id" }
    );

  if (upsertErr) throw new Error(upsertErr.message);

  // 3) Draft markieren
  const { error: updErr } = await supabase
    .from("listing_drafts")
    .update({
      status: "published",
      published_at: nowIso,
      rejection_reason: null,
    })
    .eq("id", draftId);

  if (updErr) throw new Error(updErr.message);

  adminRedirect();
}

export async function rejectDraft(draftId: string, reason: string) {
  const cleanReason = (reason || "").trim();

  // 1) Draft auf rejected setzen + published_at entfernen
  const { error: updErr } = await supabase
    .from("listing_drafts")
    .update({
      status: "rejected",
      rejection_reason: cleanReason || "Abgelehnt",
      published_at: null,
    })
    .eq("id", draftId);

  if (updErr) throw new Error(updErr.message);

  // 2) Falls es schon in listings war: raus damit
  const { error: delErr } = await supabase
    .from("listings")
    .delete()
    .eq("draft_id", draftId);

  if (delErr) throw new Error(delErr.message);

  adminRedirect();
}