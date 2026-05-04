import SiteHeader from "../../components/SiteHeader";
import CreateListingForm from "../form/CreateListingForm";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

export default async function CreateListingFormPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);
  const draftId = pick(sp, "draft");

  let initialDraft: any = null;

if (draftId) {
  const { data } = await supabaseAdmin
    .from("listing_drafts")
    .select(
      [
        "id",
        "title",
        "city",
        "price",
        "rooms",
        "size_sqm",
        "available_from",
        "available_to",
        "description",
        "email",
        "housing_type",
        "wifi",
        "washing_machine",
        "parking",
        "image_url",
        "image_urls",
      ].join(",")
    )
    .eq("id", draftId)
    .single();

  initialDraft = data ?? null;
}

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader mode="flow" rightLink={{ href: "/", label: "Zurück" }} />

      <section className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {draftId ? "Inserat bearbeiten" : "Inserat erstellen"}
        </h1>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <CreateListingForm initialDraft={initialDraft} />
        </div>
      </section>
    </main>
  );
}