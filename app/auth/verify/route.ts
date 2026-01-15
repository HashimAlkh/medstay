import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getPublicOrigin() {
  const h = await headers(); // ✅ bei dir async
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const draftId = (url.searchParams.get("draft") || "").trim();
  const token = (url.searchParams.get("token") || "").trim();

  const origin = await getPublicOrigin();

  console.log("VERIFY hit:", url.toString());
  console.log("VERIFY public origin:", origin);
  console.log("VERIFY params:", { draftId, token });

  if (!draftId || !token) {
    return NextResponse.redirect(new URL(`/create-listing/form`, origin));
  }

  const { data: draft, error } = await supabase
    .from("listing_drafts")
    .select("id,email_verified,email_verification_token")
    .eq("id", draftId)
    .single();

  console.log("VERIFY draft row:", {
    error,
    draft,
    token_in_url: token,
    token_in_db: draft?.email_verification_token,
    match: draft?.email_verification_token === token,
  });

  if (error || !draft) {
    return NextResponse.redirect(new URL(`/create-listing/form`, origin));
  }

  // ✅ Schon verifiziert -> direkt zur Preview
  if (draft.email_verified) {
    console.log("VERIFY: already verified");
    return NextResponse.redirect(
      new URL(
        `/create-listing/preview?draft=${encodeURIComponent(draftId)}&verified=1`,
        origin
      )
    );
  }

  // ✅ Token falsch -> Preview mit Hinweis
  if (draft.email_verification_token !== token) {
    return NextResponse.redirect(
      new URL(
        `/create-listing/preview?draft=${encodeURIComponent(draftId)}&verify=invalid`,
        origin
      )
    );
  }

  // ✅ Verifizieren
  await supabase
    .from("listing_drafts")
    .update({ email_verified: true, email_verification_token: null })
    .eq("id", draftId);

  return NextResponse.redirect(
    new URL(
      `/create-listing/preview?draft=${encodeURIComponent(draftId)}&verified=1`,
      origin
    )
  );
}