"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend =
  process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function siteUrl() {
  return (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

async function sendPublishedEmail(email: string | null, title: string | null, listingId: string) {
  if (!email || !resend || !process.env.RESEND_FROM) return;

  const listingUrl = `${siteUrl()}/listing/${encodeURIComponent(listingId)}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: [email],
    subject: "Dein Medstay-Inserat wurde veröffentlicht",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <p>Hallo,</p>
        <p>dein Inserat <b>${title || "dein Inserat"}</b> wurde freigeschaltet und ist jetzt online sichtbar.</p>
        <p>
          <a href="${listingUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#14b8a6;color:#fff;text-decoration:none;font-weight:600">
            Inserat ansehen
          </a>
        </p>
        <p style="color:#64748b;font-size:13px">
  Wenn du Änderungen an deinem Inserat vornehmen möchtest, antworte einfach auf diese E-Mail.
</p>
      </div>
    `,
  });
}

async function sendRejectedEmail(email: string | null, title: string | null, reason: string) {
  if (!email || !resend || !process.env.RESEND_FROM) return;

  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: [email],
    subject: "Dein Medstay-Inserat wurde nicht freigeschaltet",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <p>Hallo,</p>
        <p>dein Inserat <b>${title || "dein Inserat"}</b> wurde leider nicht freigeschaltet.</p>
        <p><b>Grund:</b> ${reason || "Kein Grund angegeben"}</p>
        <p style="color:#64748b;font-size:13px">
  Wenn du Änderungen an deinem Inserat vornehmen möchtest, antworte einfach auf diese E-Mail.
</p>

      </div>
    `,
  });
}

type DraftRow = {
  id: string;
  title: string | null;
  city: string | null;
  price: number | null;
  deposit: number | null;
  available_from: string | null;
  available_to: string | null;
  furnished: string | null;
  description: string | null;
  email: string | null;
  image_url: string | null;
  rooms: number | null;
  size_sqm: number | null;
  image_urls: string[] | null;
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
        "deposit",
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
        "rooms",
        "size_sqm",
        "bathroom_type",
        "kitchen_type",
        "street",
        "postal_code",
        "address_note",
        "status",
        "image_urls",
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
        deposit: draft.deposit,
        available_from: draft.available_from,
        available_to: draft.available_to,
        furnished: draft.furnished,
        description: draft.description,
        email: draft.email,
        image_url: draft.image_url,
        housing_type: draft.housing_type,
        rooms: draft.rooms,
        size_sqm: draft.size_sqm,
        // intern
        street: draft.street,
        postal_code: draft.postal_code,
        address_note: draft.address_note,
        image_urls: draft.image_urls,
        equipment: buildEquipment(draft),
        published_at: nowIso,
      },
      { onConflict: "draft_id" }
    );

  if (upsertErr) throw new Error(upsertErr.message);
  
  const { data: listing } = await supabase
  .from("listings")
  .select("id")
  .eq("draft_id", draft.id)
  .single();

  const { error: updErr } = await supabase
    .from("listing_drafts")
    .update({
      status: "published",
      published_at: nowIso,
      rejection_reason: null,
    })
    .eq("id", draftId);

  if (updErr) throw new Error(updErr.message);
  if (listing?.id) {
  try {
    await sendPublishedEmail(draft.email, draft.title, listing.id);
  } catch (e) {
    console.error("Published email failed:", e);
  }
}

  adminRedirect();
}

export async function rejectDraft(draftId: string, reason: string) {
  const cleanReason = (reason || "").trim();
  const { data: draft } = await supabase
  .from("listing_drafts")
  .select("title,email")
  .eq("id", draftId)
  .single();

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
  try {
  await sendRejectedEmail(
    draft?.email ?? null,
    draft?.title ?? null,
    cleanReason || "Abgelehnt"
  );
} catch (e) {
  console.error("Rejected email failed:", e);
}

  adminRedirect();
}