import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import Link from "next/link";

export default async function ManageListingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const sp = await searchParams;

  const token = sp.token;

  if (!token) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20">
        <h1 className="text-2xl font-semibold">
          Ungültiger Link
        </h1>
      </main>
    );
  }

  const { data: listing } = await supabaseAdmin
    .from("listings")
    .select(`
      id,
      title,
      draft_id,
      edit_token_expires_at
    `)
    .eq("manage_token", token)
    .single();

  if (!listing) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20">
        <h1 className="text-2xl font-semibold">
          Inserat nicht gefunden
        </h1>
      </main>
    );
  }

  const editable =
    listing.edit_token_expires_at &&
    new Date(listing.edit_token_expires_at) > new Date();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Inserat verwalten
        </h1>

        <p className="mt-3 text-slate-600">
          {listing.title}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {editable ? (
            <Link
              href={`/create-listing?draft=${listing.draft_id}`}
              className="inline-flex w-fit items-center justify-center rounded-2xl bg-teal-600 px-5 py-3 font-medium text-white hover:bg-teal-700"
            >
              Inserat bearbeiten
            </Link>
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Die Bearbeitungsfrist von 48 Stunden ist abgelaufen.
            </div>
          )}

          <form action="/api/deactivate-listing" method="POST">
            <input type="hidden" name="token" value={token} />

            <button
              type="submit"
              className="inline-flex w-fit items-center justify-center rounded-2xl border border-red-200 px-5 py-3 font-medium text-red-700 hover:bg-red-50"
            >
              Inserat deaktivieren
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}