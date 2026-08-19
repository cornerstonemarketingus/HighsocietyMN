"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  images: string[];
  fallback: string;
  name: string;
};

export function ProductGallery({ images, fallback, name }: Props) {
  const [active, setActive] = useState(images[0] ?? fallback);
  const [failed, setFailed] = useState(false);
  const visibleImages = images.slice(0, 5);
  const hero = failed ? fallback : active;

  const selectImage = (image: string) => {
    setActive(image);
    setFailed(false);
  };

  return (
    <div className="space-y-4">
      <div className="group relative aspect-square overflow-hidden border border-[#e5a12b]/25 bg-[#0c0c09] shadow-[0_35px_90px_rgba(0,0,0,0.65),0_0_60px_rgba(255,215,0,0.08)]">
        <div className="absolute inset-0 z-10 ring-1 ring-inset ring-white/10" />
        <Image
          key={hero}
          src={hero}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-5 transition duration-700 group-hover:scale-[1.025] sm:p-8"
          onError={() => setFailed(true)}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-[11px] uppercase text-[#ffc263]">
          <ImageIcon className="h-3.5 w-3.5" /> Product view
        </div>
      </div>

      {visibleImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {visibleImages.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => selectImage(image)}
              aria-label={`View ${name} image ${index + 1}`}
              className={`relative aspect-square overflow-hidden border bg-[#0c0c09] transition ${active === image ? "border-[#e5a12b] shadow-[0_0_24px_rgba(255,215,0,0.14)]" : "border-white/10 hover:border-[#e5a12b]/45"}`}
            >
              <Image src={image} alt="" fill sizes="96px" className="object-contain p-1.5" onError={(event) => { event.currentTarget.style.display = "none"; }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
