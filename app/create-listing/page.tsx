import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import ListingFlow from "../components/ListingFlow";

export default function CreateListingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader mode="flow" rightLink={{ href: "/", label: "Zurück" }} />

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
            Inserat veröffentlichen
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Vermiete deine Unterkunft an Medizinstudierende.
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-600 md:text-lg">
            Erreiche gezielt Medizinstudierende, die für PJ, Famulatur oder Pflegepraktikum eine temporäre Unterkunft suchen.
          </p>
        </div>

        <div className="mt-12">
          <ListingFlow />
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/create-listing/form"
            className="inline-flex items-center justify-center rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            Jetzt Inserat erstellen
          </Link>

        </div>
      </section>
    </main>
  );
}