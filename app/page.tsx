import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </Link>
          <Link
            href="/results"
            className="text-sm text-slate-600 hover:text-black"
          >
            Inserate ansehen
          </Link>
        </div>
      </header>

      {/* Hero + Suche */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            Unterkünfte für PJ & Famulatur
          </h1>
          <p className="text-slate-600 mb-6 max-w-2xl">
            Wohnen von Medizinstudierenden – für Medizinstudierende.
          </p>

          <form
            action="/results"
            method="get"
            className="grid gap-3 md:grid-cols-4 bg-white border rounded-2xl p-4 shadow-sm"
          >
            <input
              name="city"
              placeholder="Stadt (z. B. Mannheim)"
              className="border rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="from"
              type="date"
              className="border rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="to"
              type="date"
              className="border rounded-xl px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              Suchen
            </button>
          </form>
        </div>
      </section>

      {/* Info */}
      <section className="mx-auto max-w-5xl px-4 py-10 grid md:grid-cols-3 gap-4">
        <div className="border rounded-2xl p-4 bg-white">
          <h3 className="font-semibold mb-1">1. Suchen</h3>
          <p className="text-sm text-slate-600">
            Stadt & Zeitraum wählen.
          </p>
        </div>
        <div className="border rounded-2xl p-4 bg-white">
          <h3 className="font-semibold mb-1">2. Kontakt</h3>
          <p className="text-sm text-slate-600">
            Direkt mit Vermieter:innen schreiben.
          </p>
        </div>
        <div className="border rounded-2xl p-4 bg-white">
          <h3 className="font-semibold mb-1">3. Einziehen</h3>
          <p className="text-sm text-slate-600">
            Stressfrei wohnen während der Rotation.
          </p>
        </div>
      </section>
    </main>
  );
}