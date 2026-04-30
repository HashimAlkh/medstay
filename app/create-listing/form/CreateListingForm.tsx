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
              className={`rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/40"
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

      <section className="grid gap-4 md:grid-cols-2">
  <div>
    <label className="ms-label">Titel</label>
    <input
      name="title"
      type="text"
      placeholder="z. B. WG-Zimmer nahe Uniklinik"
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
      className="ms-input mt-1"
      required
    />
  </div>
</section>
<section className="grid gap-4 md:grid-cols-2">
  <div>
    <label className="ms-label">Zimmer</label>
    <input
      name="rooms"
      type="number"
      min={1}
      placeholder="z. B. 2"
      className="ms-input mt-1"
    />
  </div>

  <div>
    <label className="ms-label">Größe (m²)</label>
    <input
      name="size_sqm"
      type="number"
      min={1}
      placeholder="z. B. 55"
      className="ms-input mt-1"
    />
  </div>
</section>

<section className="grid gap-4 md:grid-cols-3">
    <div>
    <label className="ms-label">Preis (€)</label>
    <input
      name="price"
      type="number"
      min={1}
      placeholder="z. B. 650"
      className="ms-input mt-1"
      required
    />
  </div>
  <div>
    <label className="ms-label">Verfügbar von</label>
    <input
      name="from"
      type="date"
      className="ms-input mt-1"
      required
    />
  </div>

  <div>
    <label className="ms-label">Verfügbar bis</label>
    <input
      name="to"
      type="date"
      className="ms-input mt-1"
      required
    />
  </div>


</section>

<section className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
  <h3 className="text-sm font-semibold text-slate-900">Wohnungsdetails</h3>

  <div className="mt-4 grid gap-5">
    <div className="max-w-md">
      <ToggleGroup
        name="housing_type"
        label="Wohnungstyp"
        value={housingType}
        onChange={setHousingType}
        options={[
          { value: "apartment", label: "Wohnung" },
          { value: "room", label: "WG" },
        ]}
      />
    </div>

    <div>
      <div className="ms-label mb-2">Ausstattung</div>

      <div className="flex flex-wrap gap-2">
        {[
          ["wifi", "WLAN"],
          ["washing_machine", "Waschmaschine"],
          ["parking", "Parkplatz"],
        ].map(([name, label]) => (
          <label
            key={name}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:bg-teal-50/40"
          >
            <input
              type="checkbox"
              name={name}
              className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
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