"use client";

import { useRef, useState } from "react";
import { CloudImage } from "@/components/cloud-image";
import { cn } from "@/lib/utils";

/** Galería con swipe (scroll-snap) y miniaturas. */
export function Galeria({ fotos, alt, agotada }: { fotos: string[]; alt: string; agotada: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);

  const ir = (i: number) => {
    const el = ref.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div
          ref={ref}
          onScroll={(e) => {
            const el = e.currentTarget;
            setActual(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto rounded-xl bg-muted [scrollbar-width:none]"
        >
          {fotos.map((f, i) => (
            <div key={f} className="relative h-full w-full shrink-0 snap-center">
              <CloudImage
                src={f}
                alt={`${alt} – foto ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(min-width:768px) 50vw, 100vw"
                className={cn("object-cover", agotada && "grayscale")}
              />
            </div>
          ))}
        </div>
        {fotos.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {fotos.map((f, i) => (
              <span
                key={f}
                className={cn("h-1.5 rounded-full bg-white/60 transition-all", i === actual ? "w-5 bg-primary" : "w-1.5")}
              />
            ))}
          </div>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {fotos.map((f, i) => (
            <button
              key={f}
              type="button"
              aria-label={`Ver foto ${i + 1}`}
              onClick={() => ir(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg bg-muted ring-2 ring-transparent",
                i === actual && "ring-primary",
              )}
            >
              <CloudImage src={f} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
