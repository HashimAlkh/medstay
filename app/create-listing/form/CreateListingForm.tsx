"use client";

import { useState } from "react";
import { createDraft } from "./actions";

type ToggleOption = {
  value: string;
  label: string;
};

function ToggleGroup({
  name,
  label,
  value,
  onChange,
  options,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: ToggleOption[];
}) {
  return (
    <div>
      <div className="ms-label mb-2">{label}</div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                active
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <input type="hidden" name={name} value={value} required />
    </div>
  );
}

export default function CreateListingForm() {
  const [from, setFrom] = useState("");
  const [housingType, setHousingType] = useState("");
  const [furnished, setFurnished] = useState("");
  const [bathroomType, setBathroomType] = useState("");
  const [kitchenType, setKitchenType] = useState("");

  return (
    <form action={createDraft} className="grid gap-8">
    <section>
  <label className="ms-label">Bild der Unterkunft</label>

  <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-teal-300 hover:bg-teal-50/40">
    <div className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm">
      Bild auswählen
    </div>

    <p className="mt-3 text-sm font-medium text-slate-700">
      Hauptbild hochladen
    </p>

    <p className="mt-1 text-xs text-slate-500">
      JPG, PNG oder WebP · maximal 5 MB
    </p>

    <input
      name="image"
      type="file"
      accept="image/*"
      className="sr-only"
    />
  </label>
</section>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <section className="grid gap-5">
        <div>
          <label className="ms-label">Titel des Inserats</label>
          <input
            name="title"
            type="text"
            placeholder="z. B. Helles WG-Zimmer nahe Uniklinik"
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
      </section>

      <section className="rounded-3xl bg-slate-50 p-5">
        <h3 className="text-sm font-semibold text-slate-900">
          Adresse
        </h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Die genaue Adresse wird nicht öffentlich angezeigt. Sie dient nur der internen Prüfung.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="ms-label">Straße & Hausnummer</label>
            <input
              name="street"
              type="text"
              placeholder="z. B. Musterstraße 12"
              className="ms-input mt-1"
              required
              autoComplete="street-address"
            />
          </div>

          <div>
            <label className="ms-label">PLZ</label>
            <input
              name="postal_code"
              type="text"
              inputMode="numeric"
              placeholder="z. B. 68159"
              className="ms-input mt-1"
              required
              autoComplete="postal-code"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5">
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
            Wenn Nebenkosten inklusive sind, erwähne das kurz in der Beschreibung.
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
          </div>
        </div>
      </section>

      <section className="grid gap-5 rounded-3xl bg-slate-50 p-5">
        <h3 className="text-sm font-semibold text-slate-900">
          Wohnungsdetails
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <ToggleGroup
            name="housing_type"
            label="Wohnungstyp"
            value={housingType}
            onChange={setHousingType}
            options={[
              { value: "apartment", label: "Ganze Wohnung" },
              { value: "room", label: "Zimmer" },
            ]}
          />

          <ToggleGroup
            name="furnished"
            label="Möblierung"
            value={furnished}
            onChange={setFurnished}
            options={[
              { value: "yes", label: "möbliert" },
              { value: "no", label: "unmöbliert" },
            ]}
          />

          <ToggleGroup
            name="bathroom_type"
            label="Bad"
            value={bathroomType}
            onChange={setBathroomType}
            options={[
              { value: "private", label: "eigenes Bad" },
              { value: "shared", label: "gemeinsames Bad" },
            ]}
          />

          <ToggleGroup
            name="kitchen_type"
            label="Küche"
            value={kitchenType}
            onChange={setKitchenType}
            options={[
              { value: "private", label: "eigene Küche" },
              { value: "shared", label: "gemeinsame Küche" },
            ]}
          />
        </div>
      </section>

      <section>
        <div className="ms-label mb-2">Ausstattung</div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["wifi", "WLAN"],
            ["washing_machine", "Waschmaschine"],
            ["elevator", "Aufzug"],
            ["parking", "Parkplatz / Stellplatz"],
          ].map(([name, label]) => (
            <label
              key={name}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              <input type="checkbox" name={name} className="h-4 w-4" />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section>
        <label className="ms-label">Kurzbeschreibung</label>
        <textarea
          name="description"
          rows={5}
          placeholder="z. B. ruhige Lage, möbliert, gute Anbindung, Nebenkosten inklusive ..."
          className="ms-input mt-1 min-h-[130px]"
          required
        />
      </section>

      <section>
        <label className="ms-label">Kontakt-E-Mail</label>
        <input
          name="email"
          type="email"
          placeholder="z. B. vermieter@email.de"
          autoComplete="email"
          className="ms-input mt-1"
          required
        />
      </section>

      <div>
        <button
          type="submit"
          className="w-full rounded-2xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          Vorschau ansehen
        </button>

        <p className="mt-3 text-xs text-slate-500">
          Im nächsten Schritt prüfst du dein Inserat in der Vorschau und gehst danach zur Bezahlung.
        </p>
      </div>
    </form>
  );
}