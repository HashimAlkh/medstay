"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../lib/supabaseAdmin";

export async function publishDraft(id: string) {
  await supabaseAdmin.from("listing_drafts").update({ status: "published" }).eq("id", id);
  revalidatePath("/admin");
}

export async function unpublishDraft(id: string) {
  await supabaseAdmin.from("listing_drafts").update({ status: "submitted" }).eq("id", id);
  revalidatePath("/admin");
}