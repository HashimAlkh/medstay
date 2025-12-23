import Link from "next/link";

export default function ListingPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </Link>
          <Link href="/results" className="text-sm text-slate-600 hover:text-black">
            Zurück zu Treffern
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Inserat: <span className="text-slate-600">{params.id}</span>
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl border bg-white p-5">
            <div className="h-44 rounded-xl bg-slate-100 mb-4 flex items-center justify-center text-slate-500 text-sm">
              Bild-Platzhalter
            </div>
            <h2 className="text-lg font-semibold">Details</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Nähe zur Klinik (Demo)</li>
              <li>• Möbliert (Demo)</li>
              <li>• WLAN (Demo)</li>
              <li>• Übergabe flexibel (Demo)</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white p-5 h-fit">
            <div className="text-sm text-slate-500">Preis</div>
            <div className="text-2xl font-semibold mt-1">— €</div>
            <button className="mt-4 w-full rounded-xl bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700">
              Kontakt anfragen
            </button>
            <p className="mt-2 text-xs text-slate-500">
              (Demo) Login/Chat kommt in Phase 2.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}