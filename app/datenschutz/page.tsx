import SiteHeader from "@/app/components/SiteHeader";

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl">
      <h2 className="mt-6 text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>

      <div className="mt-2 text-base leading-8 text-slate-700">
        {children}
      </div>
    </section>
  );
}

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Datenschutzerklärung
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Hier informieren wir dich darüber, welche personenbezogenen Daten bei
            der Nutzung von medstay verarbeitet werden.
          </p>

          <div className="mt-12 space-y-14">
            <LegalSection title="Verantwortlicher">
              <p>
                Hashim Alkhateeb
                <br />
                Cheliusstraße 1-3
                <br />
                68167 Mannheim
                <br />
                Deutschland
              </p>

              <p className="mt-4">
                E-Mail:{" "}
                <a
                  href="mailto:Alkhateeb.Hashim@outlook.com"
                  className="font-medium text-teal-700 hover:text-teal-800"
                >
                  Alkhateeb.Hashim@outlook.com
                </a>
              </p>
            </LegalSection>

            <LegalSection title="Verarbeitete Daten">
              <p>
                Bei der Nutzung von medstay können insbesondere E-Mail-Adressen,
                Inseratsdaten, Wohnungsdaten, hochgeladene Bilder,
                Zahlungsinformationen sowie technische Nutzungs- und Serverdaten
                verarbeitet werden.
              </p>
            </LegalSection>

            <LegalSection title="Zweck der Verarbeitung">
              <p>
                Die Datenverarbeitung erfolgt zur Bereitstellung der Plattform,
                zur Veröffentlichung und Prüfung von Inseraten, zur Kommunikation
                mit Nutzern, zur Zahlungsabwicklung sowie zur technischen
                Sicherheit und Missbrauchsprävention.
              </p>
            </LegalSection>

            <LegalSection title="Zahlungsabwicklung">
              <p>
                Zahlungen werden über Stripe abgewickelt. Bei Nutzung der
                Zahlungsfunktion werden zahlungsbezogene Daten an Stripe
                übermittelt. Für die Verarbeitung durch Stripe gelten ergänzend
                die Datenschutzbestimmungen von Stripe.
              </p>
            </LegalSection>

            <LegalSection title="E-Mail-Versand">
              <p>
                Für den Versand von System- und Bestätigungs-E-Mails kann Resend
                eingesetzt werden.
              </p>
            </LegalSection>

            <LegalSection title="Speicherdauer">
              <p>
                Personenbezogene Daten werden nur so lange gespeichert, wie dies
                zur Bereitstellung der Plattform, zur Abwicklung der Nutzung oder
                aufgrund gesetzlicher Pflichten erforderlich ist.
              </p>
            </LegalSection>

            <section className="mt-6 rounded-2xl bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-900">Deine Rechte</h2>
              <p className="mt-3 text-base leading-8 text-slate-700">
                Du hast das Recht auf Auskunft, Berichtigung, Löschung,
                Einschränkung der Verarbeitung, Datenübertragbarkeit sowie
                Widerspruch gegen die Verarbeitung. Anfragen kannst du an die
                oben genannte E-Mail-Adresse richten.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}