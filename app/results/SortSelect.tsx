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
    <form method="get" className="mt-6 mb-4 flex items-center gap-3">
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="to" value={to} />

      <label className="text-sm text-slate-600">Sortieren:</label>
      <select
        name="sort"
        defaultValue={sort}
        className="border rounded-lg px-2 py-1 text-sm"
        onChange={(e) => e.currentTarget.form?.submit()}
      >
        <option value="price_asc">Preis: günstig zuerst</option>
        <option value="price_desc">Preis: teuer zuerst</option>
      </select>
    </form>
  );
}