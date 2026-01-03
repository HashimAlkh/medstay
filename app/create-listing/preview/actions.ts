"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitDraft(formData: FormData) {
  const id = String(formData.get("draft_id") || "").trim();
  if (!id) throw new Error("Missing draft_id");

  // 1) Draft laden und Zahlung prüfen
  const { data: draft, error: fetchErr } = await supabase
    .from("listing_drafts")
    .select("id,status,paid_at,payment_status")
    .eq("id", id)
    .single();

  if (fetchErr || !draft) throw new Error(fetchErr?.message || "Draft not found");

  if (!draft.paid_at || draft.payment_status !== "paid") {
    redirect(`/pay?draft=${encodeURIComponent(id)}&reason=unpaid`);
  }

  // 2) Nur wenn bezahlt: submitted setzen
  const { error } = await supabase
    .from("listing_drafts")
    .update({ status: "submitted" })
    .eq("id", id);

  if (error) throw new Error(error.message);

  redirect(`/create-listing/preview?draft=${encodeURIComponent(id)}&submitted=1`);
}