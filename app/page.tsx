import SiteHeader from "./components/SiteHeader";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />

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
              <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm hover:shadow-md transition">
                <div className="text-center text-lg font-medium text-slate-900">
                  Finde deine Unterkunft
                </div>
                

                <form action="/results" method="get" className="mt-4 grid gap-3">
                  <div>
                    <label className="text-slate-500 text-xs font-medium mb-1">Stadt</label>
                    <input
                      name="city"
                      placeholder="z. B. Mannheim"
                      className="ms-input mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-500 text-xs font-medium mb-1">Von</label>
                      <input
                        name="from"
                        type="date"
                        className="ms-input mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs font-medium mb-1">Bis</label>
                      <input name="to" type="date" className="ms-input mt-1" />
                    </div>
                  </div>

                  <button type="submit" className="mt-2 bg-teal-500 text-white rounded-xl px-4 py-2 text-md font-medium hover:bg-teal-600 transition shadow-sm">
                    Suchen
                  </button>

                  <p className="text-xs text-slate-500">
                    Tipp: Lass Stadt leer, um alle Inserate zu sehen.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Trust row */}
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">Kuratiert</div>
              <p className="mt-1 text-sm text-slate-600">
                Inserate werden geprüft, bevor sie sichtbar sind.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">Einfach</div>
              <p className="mt-1 text-sm text-slate-600">
                Suche → Detailseite → Kontakt. Ohne Overengineering.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">Studierendenfokus</div>
              <p className="mt-1 text-sm text-slate-600">
                Für Rotationen gedacht: Zeitraum & Stadt stehen im Zentrum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="ms-card">
            <div className="text-xs font-semibold text-slate-500">SCHRITT 1</div>
            <h3 className="mt-2 text-base font-semibold text-slate-900">Suchen</h3>
            <p className="mt-1 text-sm text-slate-600">
              Stadt & Zeitraum wählen.
            </p>
          </div>
          <div className="ms-card">
            <div className="text-xs font-semibold text-slate-500">SCHRITT 2</div>
            <h3 className="mt-2 text-base font-semibold text-slate-900">Inserat ansehen</h3>
            <p className="mt-1 text-sm text-slate-600">
              Details checken und entscheiden, ob es passt.
            </p>
          </div>
          <div className="ms-card">
            <div className="text-xs font-semibold text-slate-500">SCHRITT 3</div>
            <h3 className="mt-2 text-base font-semibold text-slate-900">Kontakt</h3>
            <p className="mt-1 text-sm text-slate-600">
              Direkt mit Vermieter:innen in Kontakt treten.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}