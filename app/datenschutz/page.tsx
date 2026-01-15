export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Datenschutzerklärung</h1>

      <p className="mb-4">
        Der Schutz deiner persönlichen Daten ist uns wichtig. Personenbezogene
        Daten werden auf dieser Website nur im technisch notwendigen Umfang
        erhoben.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        Verantwortlicher
      </h2>
      <p className="mb-4">
        medstay<br />
        Hashim Alkhateeb<br />
        kontakt@medstay.de
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        Zugriffsdaten
      </h2>
      <p className="mb-4">
        Beim Besuch dieser Website werden automatisch Informationen
        (z. B. IP-Adresse, Browsertyp, Uhrzeit des Zugriffs) erhoben.
        Diese Daten dienen ausschließlich der technischen Stabilität
        und Sicherheit.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        Inserate & Kontaktaufnahme
      </h2>
      <p className="mb-4">
        Wenn du ein Inserat erstellst oder Kontakt zu Anbieter:innen aufnimmst,
        werden die von dir angegebenen Daten ausschließlich zum Zweck der
        Vermittlung gespeichert und verarbeitet.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        Drittanbieter
      </h2>
      <p className="mb-4">
        Zur technischen Bereitstellung der Plattform werden externe
        Dienstleister (z. B. Hosting, Datenbank) eingesetzt.
        Eine Weitergabe personenbezogener Daten erfolgt nur,
        soweit dies technisch erforderlich ist.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        Deine Rechte
      </h2>
      <p className="mb-4">
        Du hast jederzeit das Recht auf Auskunft, Berichtigung,
        Löschung oder Einschränkung der Verarbeitung deiner Daten.
      </p>

      <p className="text-sm text-slate-600 mt-8">
        Stand: Januar 2026
      </p>
    </main>
  );
}