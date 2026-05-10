import SiteHeader from "@/app/components/SiteHeader";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Kontakt
          </h1>

          <div className="mt-8 space-y-6 text-base leading-8 text-slate-700">
            <p>
              Bei Fragen, Problemen oder Feedback kannst du uns jederzeit
              kontaktieren.
            </p>

            <section className="rounded-2xl bg-slate-50 p-5 mt-8">
              <h2 className="font-semibold text-slate-900">
                E-Mail
              </h2>

              <p className="mt-3">
                <a
                  href="mailto:kontakt@med-stay.de"
                  className="font-medium text-teal-700 hover:text-teal-800"
                >
                  kontakt@med-stay.de
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}