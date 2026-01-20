import SiteHeader from "../../components/SiteHeader";
import CreateListingForm from "../form/CreateListingForm";

export const dynamic = "force-dynamic";

export default function CreateListingFormPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader
  mode="flow"
  rightLink={{ href: "/", label: "Zurück" }}
/>

      <section className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Inserat erstellen
        </h1>

        <p className="mt-2 text-slate-600">
          Tragen Sie die wichtigsten Informationen ein. Im nächsten Schritt sehen Sie
          eine Vorschau und gehen dann zur Bezahlung (29 €).
        </p>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <CreateListingForm />
        </div>
      </section>
    </main>
  );
}