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

  const { error } = await supabase
    .from("listing_drafts")
    .update({ status: "submitted" })
    .eq("id", id);

  if (error) throw new Error(error.message);

  redirect(`/create-listing/preview?draft=${encodeURIComponent(id)}&submitted=1`);
}