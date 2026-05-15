import SiteHeader from "./components/SiteHeader";
import FeaturedListingsCarousel from "./components/FeaturedListingsCarousel";
import HomeSearchForm from "./components/HomeSearchForm";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const city = typeof sp.city === "string" ? sp.city : "";
  const from = typeof sp.from === "string" ? sp.from : "";
  const to = typeof sp.to === "string" ? sp.to : "";
  const max_price = typeof sp.max_price === "string" ? sp.max_price : "";
  const min_rooms = typeof sp.min_rooms === "string" ? sp.min_rooms : "";
  const min_size = typeof sp.min_size === "string" ? sp.min_size : "";
  const housing_type =
    typeof sp.housing_type === "string" ? sp.housing_type : "";

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader sticky/>


      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            {/* Left */}
            <div>
              <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                Für PJ • Famulatur • Pflegepraktikum
              </div>

              <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-slate-900">
                Finde eine möblierte Unterkunft für dein nächstes Praktikum.
              </h1>

              <p className="mt-4 text-slate-600 leading-relaxed max-w-xl">
                Zimmer und Wohnungen von Medizinstudierenden für Medizinstudierende - unkompliziert und passend zu deinem Zeitraum.
              </p>
            </div>

            {/* Right: Search Card */}
            <div className="md:justify-self-end w-full">
              <div className="rounded-3xl border border-slate-200 p-5 md:p-6 shadow-sm hover:shadow-md transition">
                <div className="text-center text-lg font-medium text-slate-900">
                  Finde deine Unterkunft
                </div>

                <HomeSearchForm
  initialCity={city}
  initialFrom={from}
  initialTo={to}
  initialMaxPrice={max_price}
  initialMinRooms={min_rooms}
  initialMinSize={min_size}
  initialHousingType={housing_type}
/>
              </div>
            </div>
          </div>
<div className="h-8 md:h-14" />
          {/* Featured Listings */}
<div className="mt-12">
  <FeaturedListingsCarousel />
</div>
<div className="h-6 md:h-14" />
{/* Why medstay */}
<div className="mt-20">
  <div className="mb-6">
    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
      Warum med<span className="text-teal-600">stay</span>?
    </h2>

  </div>

  <div className="mt-8 grid gap-4 md:grid-cols-3">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-base font-semibold text-slate-700">
        Flexible Zwischenmieten
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Finde Wohnungen passend zu PJ, Famulatur und Praktika.
      </p>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-base font-semibold text-slate-700">
        Möbliert einziehen
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Keine Möbel, keine Einrichtungskosten, kein unnötiger Stress.
      </p>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-base font-semibold text-slate-700">
        Vermiete deine Wohnung
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Vermeide Leerstand während Rotation, Auslandspraktika oder Ferien.
      </p>
    </div>
  </div>
</div>
 
           
        </div>
      </section>
            

    </main>
  );
}