"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function publishDraft(id: string) {
  if (!id) throw new Error("Missing id");

  const { error } = await supabaseAdmin
    .from("listing_drafts")
    .update({ status: "published" })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/results");
}

export async function unpublishDraft(id: string) {
  if (!id) throw new Error("Missing id");

  // zurück zu "submitted" (damit du es wieder im Admin freigeben kannst)
  const { error } = await supabaseAdmin
    .from("listing_drafts")
    .update({ status: "submitted" })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/results");
}