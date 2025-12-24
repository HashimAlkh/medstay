export default function ListingCTA() {
  return (
    <div className="listing-cta rounded-2xl border bg-white p-5 h-fit">
      <div className="text-sm text-slate-500">Preis</div>
      <div className="text-2xl font-semibold mt-1">— €</div>

      <button
        type="button"
        className="mt-6 w-full rounded-xl bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700"
      >
        Kontakt anfragen
      </button>

      <p className="mt-3 text-sm text-slate-600">
        (Demo) Login/Chat kommt in Phase 2.
      </p>
    </div>
  );
}