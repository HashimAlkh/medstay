"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { createDraft } from "./actions";
import { Wifi, WashingMachine, Car } from "lucide-react";
import { useFormStatus } from "react-dom";

type ToggleOption = {
  value: string;
  label: string;
};


function AmenityChip({
  name,
  label,
  icon,
  defaultChecked = false,
  disabled = false,
}: {
  name: string;
  label: string;
  icon: React.ReactNode;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

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
  disabled={disabled}
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
  street: string | null;
  price: number | null;
  deposit: number | null;
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

type LocalImage = {
  id: string;
  url: string;
  file?: File;
  existing: boolean;
};
function SubmitButton({
  mode = "create",
  readonly = false,
}: {
  mode?: "create" | "edit";
  readonly?: boolean;
}) {
  const { pending } = useFormStatus();

  if (readonly) return null;

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending
        ? mode === "edit"
          ? "Änderungen werden gespeichert..."
          : "Wird vorbereitet..."
        : mode === "edit"
        ? "Änderungen speichern"
        : "Vorschau ansehen"}
    </button>
  );
}
export default function CreateListingForm({
  initialDraft,
  mode = "create",
  readonly = false,
  manageToken,
}: {
  initialDraft?: InitialDraft;
  mode?: "create" | "edit";
  readonly?: boolean;
  manageToken?: string;
}) {
const formAction = 
  mode === "edit" ? "/api/manage-listing/update" : createDraft;
const [from, setFrom] = useState(initialDraft?.available_from || "");
const [to, setTo] = useState(initialDraft?.available_to || "");
const [housingType, setHousingType] = useState(
  initialDraft?.housing_type || "apartment"
);
const initialImages: LocalImage[] =
  initialDraft?.image_urls?.length
    ? initialDraft.image_urls.map((url, index) => ({
        id: `existing-${index}`,
        url,
        existing: true,
      }))
    : initialDraft?.image_url
    ? [
        {
          id: "existing-0",
          url: initialDraft.image_url,
          existing: true,
        },
      ]
    : [];

const [images, setImages] = useState<LocalImage[]>(initialImages);
const [primaryImageId, setPrimaryImageId] = useState<string | null>(
  initialImages[0]?.id || null
);
const fileInputRef = useRef<HTMLInputElement | null>(null);

function syncFileInput(nextImages: LocalImage[]) {
  if (!fileInputRef.current) return;

  const dt = new DataTransfer();

  nextImages.forEach((img) => {
    if (img.file) {
      dt.items.add(img.file);
    }
  });

  fileInputRef.current.files = dt.files;
}

  return (
    <form action={formAction} method={mode === "edit" ? "POST" : undefined} className="grid gap-8">
      {initialDraft?.id && (
  <input type="hidden" name="draft_id" value={initialDraft.id} />
)}
{mode === "edit" && manageToken && (
  <input type="hidden" name="manage_token" value={manageToken} />
)}
    <section>
  <label className="ms-label">Bild der Unterkunft</label>

{mode === "edit" && (
  <p className="mt-1 text-sm text-slate-500">
    Bilder können nach Veröffentlichung nicht direkt geändert werden.
  </p>
)}

<label
  className={`mt-2 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition ${
    mode === "edit"
      ? "cursor-not-allowed opacity-70"
      : "cursor-pointer hover:border-teal-300 hover:bg-teal-50/40"
  }`}
>
    <div className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm">
      Bild auswählen
    </div>

    <p className="mt-3 text-sm font-medium text-slate-700">
      Du kannst bis zu 5 Bilder hochladen.
    </p>

    <p className="mt-1 text-xs text-slate-500">
      JPG, PNG oder WebP · maximal 5 MB
    </p>

<input
  ref={fileInputRef}
  name="image"
  type="file"
  required={
    mode === "create" &&
    !initialDraft?.image_url &&
    !initialDraft?.image_urls?.length
  }
  disabled={readonly || mode === "edit"}
  multiple
  accept="image/*"
  className="sr-only"
  onChange={(e) => {
  const files = Array.from(e.target.files || []);

  const newImages: LocalImage[] = files.map((file) => ({
    id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
    url: URL.createObjectURL(file),
    file,
    existing: false,
  }));

  const combined = [...images, ...newImages].slice(0, 5);

  setImages(combined);
  syncFileInput(combined);

  if (!primaryImageId && combined.length > 0) {
    setPrimaryImageId(combined[0].id);
  }
}}
/>
  </label>

{images.length > 0 && (
  <p className="mt-2 text-center text-xs font-medium text-teal-700">
    {images.length} {images.length === 1 ? "Bild" : "Bilder"} ausgewählt
  </p>
)}

{images.length > 0 && (
  <div className="mt-4">
    <div className="h-56 overflow-hidden rounded-3xl bg-slate-100 md:h-[300px]">
      <img
        src={images.find((img) => img.id === primaryImageId)?.url || images[0].url}
        alt="Hauptbild"
        className="h-full w-full object-cover"
      />
    </div>

    <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
      {images.map((img) => {
        const active = img.id === primaryImageId;

        return (
          <div key={img.id} className="relative h-16 w-24 shrink-0">
            <button
              type="button"
              onClick={() => setPrimaryImageId(img.id)}
              className={`h-full w-full overflow-hidden rounded-2xl border transition ${
                active
                  ? "border-teal-500 ring-2 ring-teal-200"
                  : "border-slate-200 opacity-80 hover:opacity-100"
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>

            {mode !== "edit" && (
  <button
    type="button"
    onClick={() => {
      const updatedImages = images.filter((i) => i.id !== img.id);

      setImages(updatedImages);
      syncFileInput(updatedImages);

      if (primaryImageId === img.id) {
        setPrimaryImageId(
          updatedImages.length > 0 ? updatedImages[0].id : null
        );
      }
    }}
    className="absolute right-1 top-1 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-sm font-light text-white shadow-md ring-1 ring-white"
  >
    ×
  </button>
)}
          </div>
        );
      })}
    </div>

    <p className="mt-1 text-xs text-slate-500">
      Das erste Bild wird als Hauptbild verwendet.
    </p>
    <input
  type="hidden"
  required
  name="existing_image_urls"
  value={JSON.stringify(
    images
      .filter((img) => img.existing)
      .map((img) => img.url)
  )}
/>

<input
  type="hidden"
  name="primary_image_url"
  value={
    images.find((img) => img.id === primaryImageId)?.url || ""
  }
/>
  </div>
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
      disabled={readonly}
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
      disabled={readonly || mode === "edit"}
      placeholder="z. B. München"
      className={`ms-input mt-1 ${
  mode === "edit"
    ? "cursor-not-allowed bg-slate-100 text-slate-400"
    : ""
}`}
      required
      defaultValue={initialDraft?.city || ""}
    />
  </div>
</section>
<section>
  <label className="ms-label">Straße + Hausnummer (optional)</label>
  <input
    name="street"
    type="text"
    disabled={readonly || mode === "edit"}
    placeholder="z. B. Musterstraße 12a"
    className={`ms-input mt-1 ${
  mode === "edit"
    ? "cursor-not-allowed bg-slate-100 text-slate-400"
    : ""
}`}
    defaultValue={initialDraft?.street || ""}
  />

</section>
<section className="grid gap-4 md:grid-cols-2">
  <div>
    <label className="ms-label">Zimmer</label>
    <input
      name="rooms"
      type="number"
      disabled={readonly}
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
      disabled={readonly}
      min={1}
      placeholder="z. B. 55"
      className="ms-input mt-1"
      defaultValue={initialDraft?.size_sqm ?? ""}
    />
  </div>
</section>

<section className="grid gap-4 md:grid-cols-2">
    <div>
    <label className="ms-label">Preis (€)</label>
    <input
      name="price"
      type="number"
      disabled={readonly}
      min={1}
      placeholder="z. B. 650"
      className="ms-input mt-1"
      required
      defaultValue={initialDraft?.price ?? ""}
    />
  </div>
  <div>
  <label className="ms-label">Kaution (€)</label>
  <input
    name="deposit"
    type="number"
    disabled={readonly}
    min={0}
    placeholder="z. B. 200"
    className="ms-input mt-1"
    defaultValue={initialDraft?.deposit ?? ""}
  />
</div>
  <div>
  <label className="ms-label">Verfügbar von</label>
  <input
    name="from"
    type="date"
    disabled={readonly}
    className="ms-input mt-1"
    required
    value={from}
    max={to || undefined}
    onChange={(e) => setFrom(e.target.value)}
  />
</div>

<div>
  <label className="ms-label">Verfügbar bis</label>
  <input
    name="to"
    type="date"
    disabled={readonly}
    className="ms-input mt-1"
    required
    value={to}
    min={from || undefined}
    onChange={(e) => setTo(e.target.value)}
  />
</div>


</section>

<section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
  <h3 className="text-sm font-semibold text-slate-900">Wohnungsdetails</h3>

  <div className="mt-5 grid gap-6 md:grid-cols-2 items-start">
    {/* Wohnungstyp Switch */}
    <div className="flex flex-col gap-2">
      <div className="ms-label mb-2">Wohnungstyp</div>

      <input type="hidden" name="housing_type" disabled={readonly} value={housingType} required />

<div className="flex justify-center">
  <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
    <button
      type="button"
      disabled={readonly}
      onClick={() => setHousingType("apartment")}
      className={`w-34 rounded-xl px-6 py-2 text-sm font-semibold transition ${
        housingType === "apartment"
          ? "bg-teal-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      Wohnung
    </button>

    <button
      type="button"
      disabled={readonly}
      onClick={() => setHousingType("room")}
      className={`w-36 rounded-xl px-6 py-2 text-sm font-semibold transition ${
        housingType === "room"
          ? "bg-teal-600 text-white shadow" 
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      WG
    </button>
  </div>
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
          defaultChecked={!!initialDraft?.wifi}
          disabled={readonly}
        />

        <AmenityChip
          name="washing_machine"
          label="Waschmaschine"
          icon={<WashingMachine className="h-4 w-4" />}
          defaultChecked={!!initialDraft?.washing_machine}
          disabled={readonly}
        />

        <AmenityChip
          name="parking"
          label="Parkplatz"
          icon={<Car className="h-4 w-4" />}
          defaultChecked={!!initialDraft?.parking}
          disabled={readonly}
        />
      </div>
    </div>
  </div>
</section>


      <section>
        <label className="ms-label">Kurzbeschreibung</label>
        <textarea
          name="description"
          disabled={readonly}
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
          disabled={readonly}
          placeholder="z. B. vermieter@email.de"
          autoComplete="email"
          className="ms-input mt-1"
          required
          defaultValue={initialDraft?.email || ""}
        />
      </section>
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
  <div className="flex items-start gap-3">
    <input
      id="legal"
      name="legal"
      type="checkbox"
      disabled={readonly}
      required={mode === "create"}
      defaultChecked={mode === "edit"}
      className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
    />

    <label
      htmlFor="legal"
      className="text-sm leading-6 text-slate-600"
    >
      Ich akzeptiere die{" "}
      <Link
        href="/agb"
        target="_blank"
        className="font-medium text-teal-700 hover:text-teal-800"
      >
        AGB
      </Link>{" "}
      und die{" "}
      <Link
        href="/datenschutz"
        target="_blank"
        className="font-medium text-teal-700 hover:text-teal-800"
      >
        Datenschutzerklärung
      </Link>
      .
    </label>
  </div>
</section>
      <div>
        <SubmitButton mode={mode} readonly={readonly} />

        {mode === "create" && (
          ""
)}
      </div>
    </form>
  );
}