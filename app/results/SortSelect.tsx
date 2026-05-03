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
    <form method="get" className="mt-6 flex items-center justify-between">
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="to" value={to} />

      <div className="text-sm text-slate-600">
        Sortieren ↑↓
      </div>

      <select
        name="sort"
        defaultValue={sort}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="price_asc">Preis ↑</option>
        <option value="price_desc">Preis ↓</option>
      </select>
    </form>
  );
}