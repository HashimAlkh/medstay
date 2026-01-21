"use client";

type SortKey = "price_asc" | "price_desc";

export default function SortSelect({
  city,
  from,
  to,
  sort,
}: {
  city: string;
  from: string;
  to: string;
  sort: SortKey;
}) {
  return (
    <form method="get" className="mt-6 mb-4">
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="to" value={to} />

      <div className="flex items-center gap-3">
        <label
          htmlFor="sort"
          className="text-sm font-medium text-slate-700"
        >
          Sortieren
        </label>

        <div className="relative">
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            onChange={(e) => e.currentTarget.form?.submit()}
            className="
              appearance-none
              rounded-xl border border-slate-200 bg-white
              pl-4 pr-10 py-2
              text-sm text-slate-900
              shadow-sm
              hover:border-slate-300
              focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300
              transition
            "
          >
            <option value="price_asc">Preis: günstig zuerst</option>
            <option value="price_desc">Preis: teuer zuerst</option>
          </select>
        </div>
      </div>
    </form>
  );
}