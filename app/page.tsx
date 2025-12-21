import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/results" className="text-sm text-slate-600 hover:text-black">
              Inserate ansehen
            </Link>
            <button className="text-sm border rounded-full px-3 py-1 hover:bg-slate-100">
              Login
            </button>
          </div>
        </div>
      </header>

      <section className="bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            Unterkünfte für PJ, Famulatur & Pflegepraktikum
          </h1>
          <p className="text-slate-600 mb-6 max-w-2xl">
            Finde Wohnungen von Medizinstudierenden für Medizinstudierende – nah an der Klinik,
            fair im Preis, planbar im Voraus.
          </p>

          <form
            action="/results"
            className="grid gap-3 md:grid-cols-4 bg-white border rounded-2xl p-4 shadow-sm"
          >
            <input
              name="city"
              placeholder="Stadt (z. B. Düsseldorf)"
              className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              name="from"
              type="date"
              className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              name="to"
              type="date"
              className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-blue-700">
              Suchen
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-500">
            Nur Medizinstudierende: PJ, Famulatur, Pflegepraktikum.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 grid md:grid-cols-3 gap-4">
        <div className="border rounded-2xl p-4 bg-white">
          <h3 className="font-semibold mb-1">1. Suchen</h3>
          <p className="text-sm text-slate-600">
            Stadt & Zeitraum wählen – passende Unterkünfte entdecken.
          </p>
        </div>
        <div className="border rounded-2xl p-4 bg-white">
          <h3 className="font-semibold mb-1">2. Kontakt</h3>
          <p className="text-sm text-slate-600">
            Direkt mit Vermieter:innen (Studis) schreiben.
          </p>
        </div>
        <div className="border rounded-2xl p-4 bg-white">
          <h3 className="font-semibold mb-1">3. Einziehen</h3>
          <p className="text-sm text-slate-600">
            Stressfrei wohnen während Rotation & Dienste.
          </p>
        </div>
      </section>
    </main>
  );
}