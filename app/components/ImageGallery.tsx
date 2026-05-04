"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images }: { images: string[] }) {
  const cleanImages = images.filter(Boolean);
  const [active, setActive] = useState(cleanImages[0]);

  if (cleanImages.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-slate-100 shadow-sm md:h-[360px]">
        <Image src={active} alt="Bild" fill className="object-cover" priority />
      </div>

      {cleanImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {cleanImages.map((img, i) => {
            const isActive = active === img;

            return (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => setActive(img)}
                className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl border transition hover:scale-[1.02] ${
                  isActive
                    ? "border-teal-500 ring-2 ring-teal-200"
                    : "border-slate-200 opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Bild ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}