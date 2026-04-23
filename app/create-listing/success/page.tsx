export const dynamic = "force-dynamic";

import Link from "next/link";
import Stripe from "stripe";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { LISTING_FEE_EUR } from "@/app/lib/pricing";
import SiteHeader from "@/app/components/SiteHeader";

type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

function MessageCard({
  title,
  text,
  tone = "default",
  children,
}: {
  title: React.ReactNode;
  text?: string;
  tone?: "default" | "success" | "warning" | "danger";
  children?: React.ReactNode;
}) {
  const toneClasses =
  tone === "success"
    ? "border-slate-200 bg-white"
    : tone === "warning"
    ? "border-slate-200 bg-white"
    : tone === "danger"
    ? "border-slate-200 bg-white"
    : "border-slate-200 bg-white";

  return (
    <div className={`rounded-3xl border p-8 shadow-sm ${toneClasses}`}>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h1>
      {text ? <p className="mt-3 text-sm leading-6 text-slate-700">{text}</p> : null}
      {children}
    </div>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);
  const draftId = pick(sp, "draft");
  const sessionId = pick(sp, "session_id");

  if (!draftId || !sessionId) {
    return (
      <main className="min-h-screen bg-slate-50">
        <SiteHeader mode="flow" rightLink={{ href: "/", label: "Startseite" }} />

        <section className="mx-auto max-w-3xl px-4 py-12">
          <MessageCard
            title="Zahlung konnte nicht zugeordnet werden"
            text="Es fehlen technische Angaben zur Zahlung. Bitte gehe zurück und versuche es erneut."
            tone="warning"
          >
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
              >
                Zur Startseite
              </Link>
            </div>
          </MessageCard>
        </section>
      </main>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return (
      <main className="min-h-screen bg-slate-50">
        <SiteHeader mode="flow" rightLink={{ href: "/", label: "Startseite" }} />

        <section className="mx-auto max-w-3xl px-4 py-12">
          <MessageCard
            title="Zahlung noch nicht bestätigt"
            text="Deine Zahlung konnte noch nicht bestätigt werden. Bitte versuche es erneut."
            tone="warning"
          >
            <div className="mt-6">
              <Link
                href={`/create-listing/preview?draft=${encodeURIComponent(draftId)}`}
                className="inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
              >
                Zurück zur Vorschau
              </Link>
            </div>
          </MessageCard>
        </section>
      </main>
    );
  }

  const amountTotal = session.amount_total ?? 0;
  const expected = Math.round(LISTING_FEE_EUR * 100);

  if (amountTotal && amountTotal !== expected) {
    return (
      <main className="min-h-screen bg-slate-50">
        <SiteHeader mode="flow" rightLink={{ href: "/", label: "Startseite" }} />

        <section className="mx-auto max-w-3xl px-4 py-12">
          <MessageCard
            title="Zahlung wurde geprüft"
            text="Der Zahlbetrag stimmt nicht mit der erwarteten Inseratsgebühr überein. Bitte melde dich bei uns, falls das Problem bestehen bleibt."
            tone="warning"
          >
            <p className="mt-4 text-xs text-slate-500">
              Referenz: <span className="font-mono">{draftId}</span>
            </p>
          </MessageCard>
        </section>
      </main>
    );
  }

  const { error } = await supabaseAdmin
  .from("listing_drafts")
  .update({
    payment_status: "paid",
    paid_at: new Date().toISOString(),
    status: "submitted",
    stripe_session_id: session.id,
  })
  .eq("id", draftId);

const { data: draftData } = await supabaseAdmin
  .from("listing_drafts")
  .select("title, city")
  .eq("id", draftId)
  .single();

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <SiteHeader mode="flow" rightLink={{ href: "/", label: "Startseite" }} />

        <section className="mx-auto max-w-3xl px-4 py-12">
          <MessageCard
            title="Dein Inserat wurde erfolgreich eingereicht"
            text="Deine Zahlung ist eingegangen, aber dein Inserat konnte nicht automatisch eingereicht werden. Bitte melde dich kurz bei uns."
            tone="warning"
          >
            <p className="mt-4 text-xs text-slate-500">{error.message}</p>
            <p className="mt-2 text-xs text-slate-500">
              Referenz: <span className="font-mono">{draftId}</span>
            </p>
          </MessageCard>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader mode="flow" rightLink={{ href: "/", label: "Startseite" }} />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <MessageCard
          title={
  <>
    Dein Inserat {" "}
    <span className="font-semibold text-teal-600">
      {draftData?.title || "dein Inserat"}
    </span>{" "}
    in{" "}
    <span className="font-semibold text-teal-600">
      {draftData?.city || "deiner Stadt"}
    </span>{" "}
    wurde erfolgreich eingereicht
  </>
}
          tone="success"
        >
          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">
  Wie es jetzt weitergeht
</div>
<ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <li>• Wir prüfen dein Inserat kurz manuell.</li>
              <li>• Nach Freischaltung informieren wir dich per E-Mail.</li>
              <li>• Über den Link in der E-Mail kannst du dein Inserat online ansehen.</li>
            </ul>
          </div>

          <div className="mt-10 flex justify-center">
  <Link
    href="/results"
    className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition shadow-sm"
  >
    Jetzt Wohnungen entdecken
  </Link>

</div>


        </MessageCard>
      </section>
    </main>
  );
}