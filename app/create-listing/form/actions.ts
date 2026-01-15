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

  console.log("SITE_URL =", process.env.SITE_URL);
console.log("NEXT_PUBLIC_SITE_URL =", process.env.NEXT_PUBLIC_SITE_URL);
console.log("RESOLVED siteUrl() =", siteUrl());
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

export async function createDraft(formData: FormData) {
  // ✅ HONEYPOT – GANZ AM ANFANG
  const company = String(formData.get("company") || "").trim();
  if (company.length > 0) {
    console.warn("Honeypot triggered – spam blocked");
    return redirect("/create-listing/success");
  }

  const title = String(formData.get("title") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const price = Number(formData.get("price") || 0);
  const available_from = String(formData.get("from") || "");
  const available_to = String(formData.get("to") || "");
  const description = String(formData.get("description") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  const housing_type = String(formData.get("housing_type") || "").trim() || null;
  const furnished = String(formData.get("furnished") || "").trim() || null;

  const distanceRaw = String(formData.get("distance_km") || "").trim();
  const distance_km = distanceRaw ? Number(distanceRaw.replace(",", ".")) : null;

  const wifi = formData.get("wifi") === "on";
  const kitchen = formData.get("kitchen") === "on";
  const washing_machine = formData.get("washing_machine") === "on";
  const elevator = formData.get("elevator") === "on";
  const basement = formData.get("basement") === "on";

  // 🔐 Token generieren (einmalig pro Draft)
  const token = crypto.randomBytes(24).toString("hex");

  const { data, error } = await supabase
    .from("listing_drafts")
    .insert([
      {
        title,
        city,
        price,
        available_from,
        available_to,
        description,
        email,
        housing_type,
        furnished,
        distance_km,
        wifi,
        kitchen,
        washing_machine,
        elevator,
        basement,
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

  // ✉️ Bestätigungsmail senden (wenn ENV korrekt)
  try {
    await sendVerificationEmail(email, data.id, token);
  } catch (e) {
    console.error("Email verification send failed:", e);
    // Draft existiert trotzdem – User sieht Hinweis in Preview
  }

  // Direkt zur Vorschau, aber Zahlung erst nach Verifizierung
  redirect(`/create-listing/preview?draft=${data.id}&needs_verify=1`);
}