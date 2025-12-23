import Link from "next/link";

type SP = Record<string, string | string[] | undefined>;

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);

  const city = (Array.isArray(sp.city) ? sp.city[0] : sp.city || "").trim();
  const from = (Array.isArray(sp.from) ? sp.from[0] : sp.from || "").trim();
  const to = (Array.isArray(sp.to) ? sp.to[0] : sp.to || "").trim();
  function formatGermanDate(iso?: string) {
  if (!iso) return "__.__.____";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "__.__.____";
  return `${d}.${m}.${y}`;
}
  return (
    // ... dein restlicher JSX bleibt gleich
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

<form
  className="mt-4 space-y-3"
  action="mailto:medstay.demo@gmail.com"
  method="post"
  encType="text/plain"
>
  <input
    type="text"
    name="Name"
    placeholder="Dein Name"
    className="w-full border rounded-lg px-3 py-2 text-sm"
    required
  />
  <input
    type="email"
    name="E-Mail"
    placeholder="Deine E-Mail"
    className="w-full border rounded-lg px-3 py-2 text-sm"
    required
  />
  <textarea
  name="Nachricht"
  placeholder="Kurze Nachricht (z. B. Zeitraum, PJ/Famulatur)"
  className="w-full border rounded-lg px-3 py-2 text-sm"
  rows={5}
  required
  defaultValue={`Hallo, ich interessiere mich für das Inserat (${params.id})${city ? ` in ${city}` : ""}.
Zeitraum: ${formatGermanDate(from)} bis ${formatGermanDate(to)}.
Ich bin: PJ / Famulatur / Pflegepraktikum.
Viele Grüße`}
 />

  <button
    type="submit"
    className="w-full rounded-xl bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700"
  >
    Kontakt anfragen
  </button>
</form>

<p className="mt-2 text-xs text-slate-500">
  (MVP) Anfrage wird per E-Mail versendet.
</p>
          </div>
        </div>
      </section>
    </main>
  );
}