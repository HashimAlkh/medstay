import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import CreateListingForm from "app/create-listing/form/CreateListingForm";
import DeactivateListingForm from "./DeactivateListingForm";

export default async function ManageListingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; saved?: string }>;
}) {
  const sp = await searchParams;
  const token = sp.token;
  const saved = sp.saved === "1";

  if (!token) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20">
        <h1 className="text-2xl font-semibold">Ungültiger Link</h1>
      </main>
    );
  }

  const { data: listing } = await supabaseAdmin
    .from("listings")
    .select(`
      id,
      title,
      city,
      street,
      price,
      deposit,
      rooms,
      size_sqm,
      available_from,
      available_to,
      description,
      email,
      housing_type,
      image_url,
      image_urls,
      equipment,
      edit_token_expires_at
    `)
    .eq("manage_token", token)
    .single();

  if (!listing) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20">
        <h1 className="text-2xl font-semibold">Inserat nicht gefunden</h1>
      </main>
    );
  }

  const editable =
    listing.edit_token_expires_at &&
    new Date(listing.edit_token_expires_at) > new Date();

  const initialDraft = {
    ...listing,
    wifi: !!listing.equipment?.wifi,
    washing_machine: !!listing.equipment?.washing_machine,
    parking: !!listing.equipment?.parking,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Inserat verwalten
        </h1>

        <p className="mt-2 text-slate-600">
          Hier kannst du dein veröffentlichtes Inserat bearbeiten oder deaktivieren.
        </p>
      </div>
      {saved && (
        <div className="mb-6 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
          Änderungen wurden gespeichert.
        </div>
      )}

      {!editable && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Bearbeitungsfrist abgelaufen. Du kannst dein Inserat nicht mehr bearbeiten.
        </div>
      )}

      <div className={!editable ? "opacity-60" : ""}>
        <CreateListingForm
          mode="edit"
          initialDraft={initialDraft}
          readonly={!editable}
          manageToken={token}
        />
      </div>

      <DeactivateListingForm token={token} />
    </main>
  );
}