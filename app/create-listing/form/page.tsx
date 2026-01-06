import SiteHeader from "../../components/SiteHeader";
import CreateListingForm from "../form/CreateListingForm";

export const dynamic = "force-dynamic";

export default function CreateListingFormPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader rightLink={{ href: "/create-listing", label: "Zurück" }} />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Inserat erstellen</h1>

        <p className="mt-2 text-slate-600">
          Tragen Sie die wichtigsten Informationen ein. Im nächsten Schritt sehen Sie
          eine Vorschau und gehen dann zur Bezahlung (29 €).
        </p>

        <div className="mt-6">
          <CreateListingForm />
        </div>
      </section>
    </main>
  );
}