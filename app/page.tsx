import SiteHeader from "./components/SiteHeader";
import FeaturedListingsCarousel from "./components/FeaturedListingsCarousel";
import HomeSearchForm from "./components/HomeSearchForm";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader sticky/>


      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            {/* Left */}
            <div>
              <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                Für PJ • Famulatur • Pflegepraktikum
              </div>

              <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-slate-900">
                Unterkünfte für dein Praktikum – unkompliziert.
              </h1>

              <p className="mt-4 text-slate-600 leading-relaxed max-w-xl">
                Wohnen von Medizinstudierenden – für Medizinstudierende. Finde
                schnell passende Zimmer und Wohnungen im gewünschten Zeitraum.
              </p>
            </div>

            {/* Right: Search Card */}
            <div className="md:justify-self-end w-full">
              <div className="rounded-3xl border border-slate-200 p-5 md:p-6 shadow-sm hover:shadow-md transition">
                <div className="text-center text-lg font-medium text-slate-900">
                  Finde deine Unterkunft
                </div>

                <HomeSearchForm />
              </div>
            </div>
          </div>

          {/* Trust row */}
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 p-4">
              <div className="text-sm font-semibold text-slate-900">Kuratiert</div>
              <p className="mt-1 text-sm text-slate-600">
                Inserate werden geprüft, bevor sie sichtbar sind.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 p-4">
              <div className="text-sm font-semibold text-slate-900">Einfach</div>
              <p className="mt-1 text-sm text-slate-600">
                Suche → Detailseite → Kontakt. Ohne Overengineering.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 p-4">
              <div className="text-sm font-semibold text-slate-900">Studierendenfokus</div>
              <p className="mt-1 text-sm text-slate-600">
                Für Rotationen gedacht: Zeitraum & Stadt stehen im Zentrum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Featured Listings Carousel (neu) */}
      <FeaturedListingsCarousel />

      {/* ❌ Steps wurde entfernt */}
    </main>
  );
}