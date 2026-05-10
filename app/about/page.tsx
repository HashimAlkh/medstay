import SiteHeader from "@/app/components/SiteHeader";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Über medstay
          </h1>

          <div className="mt-8 space-y-6 text-base leading-8 text-slate-700">
            <p>
              medstay ist eine Plattform für Medizinstudierende, die für
              Praktika, Famulaturen, das PJ oder Pflegepraktika eine passende
              Unterkunft suchen.
            </p>

            <p>
              Ziel ist es, die Wohnungssuche während klinischer Rotationen
              einfacher, transparenter und stressfreier zu machen.
            </p>

            <p>
              Inserate werden vor der Veröffentlichung geprüft, um die Qualität
              der Plattform hoch zu halten.
            </p>

            <section className="rounded-2xl bg-slate-50 p-5 mt-8">
              <h2 className="font-semibold text-slate-900">
                Fokus auf Einfachheit
              </h2>

              <p className="mt-3">
                medstay konzentriert sich bewusst auf das Wesentliche:
                passende Unterkünfte für begrenzte Zeiträume – ohne unnötige
                Komplexität.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}