"use client";

import { useState } from "react";
import { createDraft } from "./actions";
import { Wifi, WashingMachine, Car } from "lucide-react";

type ToggleOption = {
  value: string;
  label: string;
};


function AmenityChip({
  name,
  label,
  icon,
}: {
  name: string;
  label: string;
  icon: React.ReactNode;
}) {
  const [checked, setChecked] = useState(false);

  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        checked
          ? "border-teal-500 bg-teal-50 text-teal-700"
          : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50/40"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="sr-only"
      />
      <span className={checked ? "text-teal-600" : "text-slate-500"}>
        {icon}
      </span>
      {label}
    </label>
  );
}


type InitialDraft = {
  id: string;
  title: string | null;
  city: string | null;
  price: number | null;
  rooms: number | null;
  size_sqm: number | null;
  available_from: string | null;
  available_to: string | null;
  description: string | null;
  email: string | null;
  housing_type: string | null;
  wifi: boolean | null;
  washing_machine: boolean | null;
  parking: boolean | null;
  image_url: string | null;
  image_urls: string[] | null;
} | null;

export default function CreateListingForm({
  initialDraft,
}: {
  initialDraft?: InitialDraft;
}) {
  const [from, setFrom] = useState(initialDraft?.available_from || "");
const [housingType, setHousingType] = useState(
  initialDraft?.housing_type || "apartment"
);
const [imageCount, setImageCount] = useState(
  initialDraft?.image_urls?.length || (initialDraft?.image_url ? 1 : 0)
);

  return (
    <form action={createDraft} className="grid gap-8">
      {initialDraft?.id && (
  <input type="hidden" name="draft_id" value={initialDraft.id} />
)}
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
  multiple
  accept="image/*"
  className="sr-only"
  onChange={(e) => {
  const files = e.target.files;
  setImageCount(files ? files.length : 0);
}}
/>
  </label>

{imageCount > 0 && (
  <p className="mt-2 text-center text-xs font-medium text-teal-700">
    {imageCount} {imageCount === 1 ? "Bild" : "Bilder"} ausgewählt
  </p>
)}
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
      defaultValue={initialDraft?.title || ""}
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
      defaultValue={initialDraft?.city || ""}
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
      defaultValue={initialDraft?.rooms ?? ""}
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
      defaultValue={initialDraft?.size_sqm ?? ""}
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
      defaultValue={initialDraft?.price ?? ""}
    />
  </div>
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
      className="ms-input mt-1"
      required
      defaultValue={initialDraft?.available_to || ""}
    />
  </div>


</section>

<section className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
  <h3 className="text-sm font-semibold text-slate-900">Wohnungsdetails</h3>

  <div className="mt-5 grid gap-6 md:grid-cols-2 items-start">
    {/* Wohnungstyp Switch */}
    <div className="flex flex-col gap-2">
      <div className="ms-label mb-2">Wohnungstyp</div>

      <input type="hidden" name="housing_type" value={housingType} required />

<div className="inline-flex w-fit rounded-full border border-slate-200 bg-white ">
  <button
          type="button"
          onClick={() => setHousingType("apartment")}
          className={`w-[220px] rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            housingType === "apartment"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Wohnung
        </button>

        <button
          type="button"
          onClick={() => setHousingType("room")}
          className={` rounded-full px-6 py-2.5 text-sm font-semibold transition ${
            housingType === "room"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          WG
        </button>
      </div>
    </div>

    {/* Ausstattung */}
    <div className="flex flex-col gap-2">
      <div className="ms-label mb-2">Ausstattung</div>

      <div className="flex flex-wrap gap-2">
        <AmenityChip
          name="wifi"
          label="WLAN"
          icon={<Wifi className="h-4 w-4" />}
        />

        <AmenityChip
          name="washing_machine"
          label="Waschmaschine"
          icon={<WashingMachine className="h-4 w-4" />}
        />

        <AmenityChip
          name="parking"
          label="Parkplatz"
          icon={<Car className="h-4 w-4" />}
        />
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
          defaultValue={initialDraft?.description || ""}
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
          defaultValue={initialDraft?.email || ""}
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