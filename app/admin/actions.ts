"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Wenn du im resend.dev Testmodus bist, setz das einmalig in Codespaces Secrets:
// RESEND_TEST_TO=hashim-2412@hotmail.com
// Dann werden ALLE Mails zum Testen dorthin geschickt (egal welche Inserat-Mail drinsteht).
const RESEND_TEST_TO = (process.env.RESEND_TEST_TO || "").trim().toLowerCase();

function canSendMail() {
  return !!(resend && process.env.RESEND_FROM);
}

function normalizeEmail(email: string | null | undefined) {
  const v = (email || "").trim().toLowerCase();
  return v.length ? v : null;
}

async function getDraftBasics(draftId: string) {
  const { data, error } = await supabaseAdmin
    .from("listing_drafts")
    .select("id,status,email,title,city")
    .eq("id", draftId)
    .single();

  if (error || !data) throw new Error("Draft nicht gefunden");

  return data as {
    id: string;
    status: string | null;
    email: string | null;
    title: string | null;
    city: string | null;
  };
}

async function safeSendEmail(opts: {
  to: string | null;
  subject: string;
  html: string;
}) {
  if (!canSendMail()) return;

  // Empfänger bestimmen:
  // - Wenn RESEND_TEST_TO gesetzt ist: IMMER dahin (stabil fürs Testing)
  // - Sonst: echte Inserat-Mail (normalisiert)
  const realTo = normalizeEmail(opts.to);
  const to = RESEND_TEST_TO || realTo;

  if (!to) return;

  try {
    await resend!.emails.send({
      from: process.env.RESEND_FROM!,
      to: [to],
      subject: opts.subject,
      html: opts.html,
    });

  } catch {
 console.error("❌ Resend failed");
  }
}

/** published Mail nur bei echtem Übergang */
export async function publishDraft(draftId: string) {
  if (!draftId) throw new Error("publishDraft: draftId fehlt");

  const current = await getDraftBasics(draftId);
  const shouldSend = current.status === "submitted" || current.status === "rejected";

  // Update zuerst (DB ist Truth)
  const { error } = await supabaseAdmin
    .from("listing_drafts")
    .update({ status: "published", rejection_reason: null })
    .eq("id", draftId);

  if (error) throw new Error("Inserat konnte nicht veröffentlicht werden");

  if (shouldSend) {
    await safeSendEmail({
      to: current.email,
      subject: "Dein Inserat wurde veröffentlicht ✅",
      html: `<p>Hi!</p>
             <p>Dein Inserat <b>${current.title ?? ""}</b> ist jetzt online.</p>`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/results");
  revalidatePath(`/listing/${draftId}`);
}

/** keine Mail */
export async function unpublishDraft(draftId: string) {
  if (!draftId) throw new Error("unpublishDraft: draftId fehlt");

  const { error } = await supabaseAdmin
    .from("listing_drafts")
    .update({ status: "submitted" })
    .eq("id", draftId);

  if (error) throw new Error("Inserat konnte nicht zurückgezogen werden");

  revalidatePath("/admin");
  revalidatePath("/results");
  revalidatePath(`/listing/${draftId}`);
}

/** rejected Mail nur bei echtem Übergang */
export async function rejectDraft(draftId: string, reason: string) {
  if (!draftId) throw new Error("rejectDraft: draftId fehlt");

  const cleanReason = (reason || "").trim();
  if (cleanReason.length < 3) throw new Error("Ablehnungsgrund fehlt/zu kurz");

  const current = await getDraftBasics(draftId);
  const shouldSend = current.status !== "rejected"; // Doppelclick vermeiden

  const { error } = await supabaseAdmin
    .from("listing_drafts")
    .update({ status: "rejected", rejection_reason: cleanReason })
    .eq("id", draftId);

  if (error) throw new Error("Inserat konnte nicht abgelehnt werden");

  if (shouldSend) {
    await safeSendEmail({
      to: current.email,
      subject: "Dein Inserat wurde abgelehnt",
      html: `<p>Hi!</p>
             <p>Dein Inserat <b>${current.title ?? ""}</b> wurde leider abgelehnt.</p>
             <p><b>Grund:</b> ${cleanReason}</p>
             <p>Du kannst es anpassen und erneut einreichen.</p>`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/results");
  revalidatePath(`/listing/${draftId}`);
}