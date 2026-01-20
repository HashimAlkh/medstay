"use client";

import { useState } from "react";
import { createDraft } from "./actions";

export default function CreateListingForm() {
  const [from, setFrom] = useState("");

  return (
    <form action={createDraft} className="grid gap-5">
      {/* Honeypot – nicht ausfüllen */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <label className="ms-label">Titel des Inserats</label>
        <input
          name="title"
          type="text"
          placeholder="z. B. WG-Zimmer nahe Uniklinik"
          autoComplete="off"
          className="ms-input mt-1"
          required
        />
      </div>

      <div>
        <label className="ms-label">Stadt</label>
        <input
          name="city"
          type="text"
          placeholder="z. B. Mannheim"
          autoComplete="address-level2"
          className="ms-input mt-1"
          required
        />
      </div>

      <div>
        <label className="ms-label">Monatspreis (€)</label>
        <input
          name="price"
          type="number"
          placeholder="z. B. 650"
          min={1}
          step="any"
          inputMode="numeric"
          className="ms-input mt-1"
          required
        />
        <p className="mt-1 text-xs text-slate-500">
          Tipp: Möbliert/inkl. Nebenkosten kurz in die Beschreibung.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="ms-label">Verfügbar von</label>
          <input
            name="from"
            type="date"
            className="ms-input mt-1"
            required
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="ms-label">Verfügbar bis</label>
          <input
            name="to"
            type="date"
            min={from || undefined}
            className="ms-input mt-1"
            required
          />
          <p className="mt-1 text-xs text-slate-500">
            „Bis“ darf nicht vor „Von“ liegen.
          </p>
        </div>
      </div>

      {/* Zusatzinfos (MVP): Entfernung, Wohnungstyp, Möblierung */}
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="ms-label mb-1">Wohnungstyp</div>
          <select name="housing_type" className="ms-select w-full" required>
            <option value="">Bitte wählen</option>
            <option value="apartment">Ganze Wohnung</option>
            <option value="room">Zimmer</option>
          </select>
        </div>

        <div>
          <div className="ms-label mb-1">Entfernung zur Klinik/Uni (km)</div>
          <input
            name="distance_km"
            className="ms-input"
            inputMode="decimal"
            placeholder="z. B. 1,2"
          />
        </div>
      </div>

      <div className="mt-1">
        <div className="ms-label mb-1">Möblierung</div>
        <select name="furnished" className="ms-select w-full">
          <option value="">Bitte wählen</option>
          <option value="yes">möbliert</option>
          <option value="partial">teilmöbliert</option>
          <option value="no">unmöbliert</option>
        </select>
      </div>

      {/* Ausstattung */}
      <div className="mt-2">
        <div className="ms-label mb-2">Ausstattung</div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="wifi" className="h-4 w-4" />
            WLAN
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="kitchen" className="h-4 w-4" />
            Küche
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="washing_machine" className="h-4 w-4" />
            Waschmaschine
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="elevator" className="h-4 w-4" />
            Aufzug
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="basement" className="h-4 w-4" />
            Keller
          </label>
        </div>
      </div>

      <div>
        <label className="ms-label">Kurzbeschreibung</label>
        <textarea
          name="description"
          rows={4}
          placeholder="Kurze Beschreibung der Unterkunft (möbliert, WLAN, Nähe Klinik, etc.)"
          className="ms-input mt-1 min-h-[110px]"
          required
        />
      </div>

      <div>
        <label className="ms-label">Kontakt-E-Mail</label>
        <input
          name="email"
          type="email"
          placeholder="z. B. vermieter@email.de"
          autoComplete="email"
          className="ms-input mt-1"
          required
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-xl bg-teal-600 text-white py-3 text-sm font-medium hover:bg-teal-700 transition shadow-sm"
      >
        Vorschau ansehen
      </button>

      <p className="mt-3 text-xs text-slate-500">
        Im nächsten Schritt sehen Sie eine Vorschau und gehen dann zur Bezahlung (29 €).
      </p>
    </form>
  );
}