import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
export default function CreateListingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader rightLink={{ href: "/", label: "Zurück" }} />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Inserat einstellen – passende Medizinstudierende erreichen
        </h1>

        <p className="mt-4 text-slate-700">
          Medstay ist eine spezialisierte Plattform für PJ, Famulatur und
          Pflegepraktikum. Ihre Anzeige wird gezielt Medizinstudierenden
          angezeigt – ohne Massenanfragen oder Zweckentfremdung.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <h2 className="font-semibold">🎯 Zielgerichtete Anfragen</h2>
            <p className="mt-1 text-slate-700">
              Ihre Anzeige ist ausschließlich für Medizinstudierende sichtbar,
              die für einen klar definierten Zeitraum eine Unterkunft suchen.
            </p>
          </div>

          <div>
            <h2 className="font-semibold">
              🗓️ Temporäre Vermietung – passend zum Klinikalltag
            </h2>
            <p className="mt-1 text-slate-700">
              Die meisten Nutzer suchen für 1–6 Monate – ideal für möblierte
              Wohnungen, freie Zimmer oder befristete Vermietung.
            </p>
          </div>

          <div>
            <h2 className="font-semibold">🔁 Optional: Wohnungstausch & Ringtausch</h2>
            <p className="mt-1 text-slate-700">
              In passenden Fällen kann über Medstay auch ein Wohnungstausch oder
              Ringtausch zwischen mehreren Parteien initiiert werden – z. B.
              wenn Wohnungen zeitlich versetzt frei werden.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              (abhängig von Verfügbarkeit und Nachfrage)
            </p>
          </div>

          <div>
            <h2 className="font-semibold">✅ Einfach & fair</h2>
            <p className="mt-1 text-slate-700">
              Inserat einstellen, sichtbar für die richtige Zielgruppe – keine
              Abos, keine Provision.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border bg-white p-6">
          <div className="text-sm text-slate-500">Preis</div>
          <div className="mt-1 text-3xl font-semibold">29 €</div>
          <div className="mt-1 text-sm text-slate-600">
            einmalig · 30 Tage sichtbar
          </div>

          <Link
  href="/create-listing/form"
  className="mt-6 block w-full text-center rounded-xl bg-blue-600 text-white py-3 text-sm font-medium hover:bg-blue-700"
>
  Inserat erstellen (29 €)
</Link>

          <p className="mt-3 text-xs text-slate-500">
            Bezahlung und Inseratserstellung folgen im nächsten Schritt.
          </p>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Medstay befindet sich aktuell im Aufbau. Wir starten bewusst klein, um
          Qualität und Fairness sicherzustellen.
        </p>
      </section>
    </main>
  );
}