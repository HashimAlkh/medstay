"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import crypto from "crypto";

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

async function sendVerificationEmail(toEmail: string, draftId: string, token: string) {
  if (!resend) throw new Error("RESEND_API_KEY fehlt");
  if (!process.env.RESEND_FROM) throw new Error("RESEND_FROM fehlt");

  const verifyLink = `${siteUrl()}/auth/verify?draft=${encodeURIComponent(
    draftId
  )}&token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: [toEmail],
    subject: "Bitte bestätige deine E-Mail für dein Medstay-Inserat",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.5">
        <p>Hi,</p>
        <p>bitte bestätige kurz deine E-Mail-Adresse, damit du dein Inserat einreichen und bezahlen kannst.</p>
        <p>
          <a href="${verifyLink}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#14b8a6;color:#fff;text-decoration:none;font-weight:600">
            E-Mail bestätigen
          </a>
        </p>
        <p style="color:#64748b;font-size:12px">
          Falls der Button nicht geht, kopiere diesen Link in den Browser:<br/>
          ${verifyLink}
        </p>
      </div>
    `,
  });
}

function asBoolCheckbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function asEnumPrivateShared(val: string) {
  const v = (val || "").trim();
  return v === "private" || v === "shared" ? v : null;
}

async function uploadListingImage(file: File, draftId: string, index: number) {
  if (!file || file.size === 0) return null;

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Ein Bild ist zu groß. Maximal erlaubt sind 5 MB.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Bitte lade nur gültige Bilddateien hoch.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${draftId}/image-${index + 1}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("listing-photos")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage
    .from("listing-photos")
    .getPublicUrl(path);

  return data.publicUrl;
}



export async function createDraft(formData: FormData) {
  // ✅ HONEYPOT – GANZ AM ANFANG
  const company = String(formData.get("company") || "").trim();
  if (company.length > 0) {
    console.warn("Honeypot triggered – spam blocked");
    return redirect("/create-listing/success");
  }

  const draftId = String(formData.get("draft_id") || "").trim();
const isEditing = !!draftId;
  const title = String(formData.get("title") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const price = Number(formData.get("price") || 0);
  const deposit = Number(formData.get("deposit") || 0) || null;
  const rooms = Number(formData.get("rooms") || 0) || null;
  const size_sqm = Number(formData.get("size_sqm") || 0) || null;
  const available_from = String(formData.get("from") || "");
  const available_to = String(formData.get("to") || "");
  const description = String(formData.get("description") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  const housing_type = String(formData.get("housing_type") || "").trim() || null;
  const furnished = null;

  // Adresse (privat)
  const street = null;
const postal_code = null;
const address_note = null;

  // Ausstattung
  const wifi = asBoolCheckbox(formData, "wifi");
  const washing_machine = asBoolCheckbox(formData, "washing_machine");
  const parking = asBoolCheckbox(formData, "parking");

  // Private/shared
const bathroom_type = null;
const kitchen_type = null;

  // 🔐 Token generieren (einmalig pro Draft)
  const token = crypto.randomBytes(24).toString("hex");

const payload = {
  title,
  city,
  price,
  deposit,
  available_from,
  available_to,
  description,
  email,
  housing_type,
  furnished,
  rooms,
  size_sqm,

  street,
  postal_code,
  address_note,

  wifi,
  washing_machine,
  parking,
  bathroom_type,
  kitchen_type,
};

let finalDraftId = draftId;

if (isEditing) {
  const { error } = await supabase
    .from("listing_drafts")
    .update(payload)
    .eq("id", draftId);

  if (error) {
    throw new Error(error.message || "Draft konnte nicht aktualisiert werden");
  }
} else {
  const { data, error } = await supabase
    .from("listing_drafts")
    .insert([
      {
        ...payload,
        status: "draft",
        email_verified: false,
        email_verification_token: token,
        email_verification_sent_at: new Date().toISOString(),
      },
    ])
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Draft konnte nicht gespeichert werden");
  }

  finalDraftId = data.id;
}
let existingImageUrls: string[] = [];

try {
  existingImageUrls = JSON.parse(
    String(formData.get("existing_image_urls") || "[]")
  );
} catch {
  existingImageUrls = [];
}

const primaryImageUrl = String(formData.get("primary_image_url") || "").trim();

 const files = formData
  .getAll("image")
  .filter((item): item is File => item instanceof File && item.size > 0)
  .slice(0, 5);

const uploadedImageUrls: string[] = [];

for (let i = 0; i < files.length; i++) {
  const imageUrl = await uploadListingImage(files[i], finalDraftId, i);
  if (imageUrl) uploadedImageUrls.push(imageUrl);
}

const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls].slice(0, 5);

if (finalImageUrls.length > 0 || isEditing) {
  const finalMainImage =
    primaryImageUrl && finalImageUrls.includes(primaryImageUrl)
      ? primaryImageUrl
      : finalImageUrls[0] || null;

  const { error: imageUpdateError } = await supabase
    .from("listing_drafts")
    .update({
      image_url: finalMainImage,
      image_urls: finalImageUrls,
    })
    .eq("id", finalDraftId);

  if (imageUpdateError) {
    throw new Error(imageUpdateError.message);
  }
}

  // ✉️ Bestätigungsmail senden (wenn ENV korrekt)
  if (!isEditing) {
  try {
    await sendVerificationEmail(email, finalDraftId, token);
  } catch (e) {
    console.error("Email verification send failed:", e);
  }
}

redirect(
  `/create-listing/preview?draft=${encodeURIComponent(finalDraftId)}${
    isEditing ? "&updated=1" : "&needs_verify=1"
  }`
);
}