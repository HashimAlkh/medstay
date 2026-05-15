"use client";

import { useState } from "react";

export default function HomeSearchForm({
  initialCity = "",
  initialFrom = "",
  initialTo = "",
  initialMaxPrice = "",
  initialMinRooms = "",
  initialMinSize = "",
  initialHousingType = "",
}: {
  initialCity?: string;
  initialFrom?: string;
  initialTo?: string;
  initialMaxPrice?: string;
  initialMinRooms?: string;
  initialMinSize?: string;
  initialHousingType?: string;
}) {
  const [open, setOpen] = useState(
    !!initialMaxPrice || !!initialMinRooms || !!initialMinSize || !!initialHousingType
  );

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);

  return (
    <form action="/results" method="get" className="mt-4 grid gap-3">
      <div>
        <label className="ms-label">Stadt</label>
        <input
  name="city"
  placeholder="z. B. Mannheim"
  className="ms-input mt-1"
  defaultValue={initialCity}
/>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="ms-label">Von</label>
          <input
  name="from"
  type="date"
  className="ms-date-input mt-1"
  value={from}
  max={to || undefined}
  onChange={(e) => setFrom(e.target.value)}
/>
        </div>

        <div>
          <label className="ms-label">Bis</label>
          <input

  name="to"

  type="date"

  className="ms-date-input mt-1"

  value={to}

  min={from || undefined}

  onChange={(e) => setTo(e.target.value)}

/>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-left text-sm font-semibold text-teal-700 hover:text-teal-800"
      >
        Erweiterte Suche {open ? "−" : "+"}
      </button>

      {open && (
        <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
          <div>
            <label className="ms-label">Preis bis</label>
            <input
  name="max_price"
  type="number"
  placeholder="z. B. 700"
  className="ms-input mt-1"
  defaultValue={initialMaxPrice}
/>
          </div>

          <div>
            <label className="ms-label">Zimmer ab</label>
            <input name="min_rooms" type="number" placeholder="z. B. 1" className="ms-input mt-1" defaultValue={initialMinRooms} />
          </div>

          <div>
            <label className="ms-label">Größe ab</label>
            <input name="min_size" type="number" placeholder="m²" className="ms-input mt-1" defaultValue={initialMinSize} />
          </div>

          <div>
            <label className="ms-label">Typ</label>
            <select
  name="housing_type"
  className="ms-input mt-1"
  defaultValue={initialHousingType}
>
              <option value="">Alle</option>
              <option value="apartment">Wohnung</option>
              <option value="room">WG</option>
            </select>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="mt-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
      >
        Suchen
      </button>

    
    </form>
  );
}