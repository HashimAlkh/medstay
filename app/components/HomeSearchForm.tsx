"use client";

import { useState } from "react";

export default function HomeSearchForm() {
  const [open, setOpen] = useState(false);

  return (
    <form action="/results" method="get" className="mt-4 grid gap-3">
      <div>
        <label className="ms-label">Stadt</label>
        <input name="city" placeholder="z. B. Mannheim" className="ms-input mt-1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="ms-label">Von</label>
          <input name="from" type="date" className="ms-input mt-1" />
        </div>

        <div>
          <label className="ms-label">Bis</label>
          <input name="to" type="date" className="ms-input mt-1" />
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
            <input name="max_price" type="number" placeholder="z. B. 700" className="ms-input mt-1" />
          </div>

          <div>
            <label className="ms-label">Zimmer ab</label>
            <input name="min_rooms" type="number" placeholder="z. B. 1" className="ms-input mt-1" />
          </div>

          <div>
            <label className="ms-label">Größe ab</label>
            <input name="min_size" type="number" placeholder="m²" className="ms-input mt-1" />
          </div>

          <div>
            <label className="ms-label">Typ</label>
            <select name="housing_type" className="ms-input mt-1">
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

      <p className="text-xs text-slate-500">
        Tipp: Lass Stadt leer, um alle Inserate zu sehen.
      </p>
    </form>
  );
}