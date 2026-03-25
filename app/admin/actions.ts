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

  housing_type: string | null;

  wifi: boolean | null;
  washing_machine: boolean | null;
  elevator: boolean | null;
  parking: boolean | null;

  bathroom_type: string | null;
  kitchen_type: string | null;

  street: string | null;
  postal_code: string | null;
  address_note: string | null;

  status: string | null;
};

function buildEquipment(draft: DraftRow) {
  return {
    wifi: !!draft.wifi,
    washing_machine: !!draft.washing_machine,
    elevator: !!draft.elevator,
    parking: !!draft.parking,
    bathroom_type: draft.bathroom_type ?? null,
    kitchen_type: draft.kitchen_type ?? null,
    housing_type: draft.housing_type ?? null,
  };
}

function adminRedirect() {
  return redirect(`/admin?key=${encodeURIComponent(process.env.ADMIN_KEY || "")}`);
}

export async function publishDraft(draftId: string) {
  const { data: draft, error: fetchErr } = await supabase
    .from("listing_drafts")
    .select(
      [
        "id",
        "title",
        "city",
        "price",
        "available_from",
        "available_to",
        "furnished",
        "description",
        "email",
        "image_url",
        "housing_type",
        "wifi",
        "washing_machine",
        "elevator",
        "parking",
        "bathroom_type",
        "kitchen_type",
        "street",
        "postal_code",
        "address_note",
        "status",
      ].join(",")
    )
    .eq("id", draftId)
    .single<DraftRow>();

  if (fetchErr || !draft) {
    throw new Error(fetchErr?.message || "Draft nicht gefunden");
  }

  const nowIso = new Date().toISOString();

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
        housing_type: draft.housing_type,

        // intern
        street: draft.street,
        postal_code: draft.postal_code,
        address_note: draft.address_note,

        equipment: buildEquipment(draft),
        published_at: nowIso,
      },
      { onConflict: "draft_id" }
    );

  if (upsertErr) throw new Error(upsertErr.message);

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

  const { error: updErr } = await supabase
    .from("listing_drafts")
    .update({
      status: "rejected",
      rejection_reason: cleanReason || "Abgelehnt",
      published_at: null,
    })
    .eq("id", draftId);

  if (updErr) throw new Error(updErr.message);

  const { error: delErr } = await supabase
    .from("listings")
    .delete()
    .eq("draft_id", draftId);

  if (delErr) throw new Error(delErr.message);

  adminRedirect();
}