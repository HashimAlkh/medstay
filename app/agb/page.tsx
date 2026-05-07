import SiteHeader from "@/app/components/SiteHeader";

export default function AGBPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Allgemeine Geschäftsbedingungen
          </h1>

          <div className="mt-8 space-y-10 text-base leading-7 text-slate-700">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Geltungsbereich
              </h2>

              <p className="mt-3">
                Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der
                Plattform medstay.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Leistungsbeschreibung
              </h2>

              <p className="mt-3">
                medstay stellt eine Plattform zur Veröffentlichung und Suche von
                Wohnungs- und Zimmerangeboten bereit. medstay vermittelt
                lediglich den Kontakt zwischen Nutzern und wird nicht
                Vertragspartei von Mietverträgen.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Inserate
              </h2>

              <p className="mt-3">
                Nutzer sind für die Inhalte ihrer Inserate selbst verantwortlich.
                medstay behält sich das Recht vor, Inserate zu prüfen,
                abzulehnen, zu bearbeiten oder zu entfernen.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Inseratsgebühr
              </h2>

              <p className="mt-3">
                Für das Veröffentlichen eines Inserats kann eine Gebühr erhoben
                werden. Die Veröffentlichung erfolgt erst nach erfolgreicher
                Zahlung und manueller Freigabe durch medstay.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Kein Anspruch auf Veröffentlichung
              </h2>

              <p className="mt-3">
                Es besteht kein Anspruch auf Veröffentlichung eines Inserats.
                medstay kann Inserate insbesondere bei rechtswidrigen,
                irreführenden oder betrugsverdächtigen Inhalten ablehnen.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Haftung
              </h2>

              <p className="mt-3">
                medstay übernimmt keine Gewähr für die Richtigkeit von
                Inseraten, die Identität der Nutzer oder das Zustandekommen
                eines Mietverhältnisses.
              </p>
            </section>

            <section className="rounded-2xl bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-900">
                Keine Maklerrolle
              </h2>

              <p className="mt-3">
                medstay ist kein Immobilienmakler und tritt nicht als Vermieter,
                Vertreter oder Vertragspartei auf.
              </p>

              <p className="mt-3">
                Mietverträge kommen ausschließlich zwischen den jeweiligen
                Nutzern zustande.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Widerruf
              </h2>

              <p className="mt-3">
                Bei digitalen Dienstleistungen kann das Widerrufsrecht
                erlöschen, sobald die Leistung vollständig erbracht wurde.
                Dies ist insbesondere nach Veröffentlichung des Inserats der
                Fall.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}