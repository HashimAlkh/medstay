import SiteHeader from "../../components/SiteHeader";

export default function CreateListingFormPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader rightLink={{ href: "/create-listing", label: "Zurück" }} />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          Inserat erstellen
        </h1>

        <p className="mt-2 text-slate-600">
          Tragen Sie die wichtigsten Informationen ein. Das Inserat wird im
          nächsten Schritt überprüft und veröffentlicht.
        </p>

        <form className="mt-8 space-y-5" method="get" action="/create-listing/preview">
  <div>
    <label className="block text-sm font-medium text-slate-700">Titel des Inserats</label>
    <input
      name="title"
      type="text"
      placeholder="z. B. WG-Zimmer nahe Uniklinik"
      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-700">Stadt</label>
    <input
      name="city"
      type="text"
      placeholder="z. B. Mannheim"
      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-700">Monatspreis (€)</label>
    <input
      name="price"
      type="number"
      placeholder="z. B. 650"
      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
      required
    />
  </div>

  <div className="grid gap-4 md:grid-cols-2">
    <div>
      <label className="block text-sm font-medium text-slate-700">Verfügbar von</label>
      <input
        name="from"
        type="date"
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700">Verfügbar bis</label>
      <input
        name="to"
        type="date"
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
        required
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-700">Kurzbeschreibung</label>
    <textarea
      name="description"
      rows={4}
      placeholder="Kurze Beschreibung der Unterkunft"
      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-700">Kontakt-E-Mail</label>
    <input
      name="email"
      type="email"
      placeholder="z. B. vermieter@email.de"
      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
      required
    />
  </div>

  <button
    type="submit"
    className="mt-6 w-full rounded-xl bg-blue-600 text-white py-3 text-sm font-medium hover:bg-blue-700"
  >
    Vorschau ansehen
  </button>

  <p className="mt-3 text-xs text-slate-500">
    Im nächsten Schritt sehen Sie eine Vorschau und gehen dann zur Bezahlung (19 €).
  </p>
</form>
      </section>
    </main>
  );
}