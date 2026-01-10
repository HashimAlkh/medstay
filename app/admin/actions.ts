"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../lib/supabaseAdmin";

/**
 * Draft veröffentlichen
 * status: submitted | rejected -> published
 */
export async function publishDraft(draftId: string) {
 
  console.log("✅ publishDraft called");
  console.log("ENV RESEND_API_KEY set?", !!process.env.RESEND_API_KEY);
  console.log("ENV RESEND_FROM:", process.env.RESEND_FROM);

  // ⬇️ AB HIER dein bestehender Code
  if (!draftId) {
    throw new Error("publishDraft: draftId fehlt");
  }

  const { error } = await supabaseAdmin
    .from("listing_drafts")
    .update({
      status: "published",
      rejection_reason: null, // falls vorher abgelehnt
    })
    .eq("id", draftId);

  if (error) {
    console.error("publishDraft error:", error);
    throw new Error("Inserat konnte nicht veröffentlicht werden");
  }

  // Admin + Results + Detail neu laden
  revalidatePath("/admin");
  revalidatePath("/results");
  revalidatePath(`/listing/${draftId}`);
}

/**
 * Draft ablehnen (mit Begründung)
 * status: submitted | published -> rejected
 */
export async function rejectDraft(draftId: string, reason: string) {
  if (!draftId) {
    throw new Error("rejectDraft: draftId fehlt");
  }

  if (!reason || reason.trim().length < 3) {
    throw new Error("Ablehnungsgrund fehlt oder ist zu kurz");
  }

  const { error } = await supabaseAdmin
    .from("listing_drafts")
    .update({
      status: "rejected",
      rejection_reason: reason.trim(),
    })
    .eq("id", draftId);

  if (error) {
    console.error("rejectDraft error:", error);
    throw new Error("Inserat konnte nicht abgelehnt werden");
  }

  revalidatePath("/admin");
  revalidatePath("/results");
  revalidatePath(`/listing/${draftId}`);
}