import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";

type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString();
}

export default async function PayPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);

  const title = pick(sp, "title");
  const city = pick(sp, "city");
  const price = pick(sp, "price");
  const from = pick(sp, "from");
  const to = pick(sp, "to");
  const description = pick(sp, "description");
  const email = pick(sp, "email");

  const qs = new URLSearchParams({
    title,
    city,
    price,
    from,
    to,
    description,
    email,
  }).toString();

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader rightLink={{ href: `/create-listing/preview?${qs}`, label: "Zurück" }} />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Bezahlung</h1>
        <p className="mt-2 text-slate-600">
          (MVP) Hier wird im nächsten Schritt die Zahlung integriert. Danach wird
          Ihr Inserat veröffentlicht.
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-6">
          <div className="text-sm text-slate-500">Preis</div>
          <div className="mt-1 text-3xl font-semibold">19 €</div>
          <div className="mt-1 text-sm text-slate-600">einmalig · 30 Tage sichtbar</div>

          <Link
  href="/create-listing/success"
  className="mt-6 block w-full text-center rounded-xl bg-blue-600 text-white py-3 text-sm font-medium hover:bg-blue-700"
>
  Bezahlen (Demo) → Inserat übermitteln
</Link>

          <p className="mt-3 text-xs text-slate-500">
            Wir starten bewusst schlank. Zahlung (z. B. Stripe) folgt, sobald der
            Flow validiert ist.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href={`/create-listing/preview?${qs}`}
            className="text-sm text-slate-600 hover:text-black"
          >
            Zurück zur Vorschau
          </Link>
        </div>
      </section>
    </main>
  );
}