import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CloudImage } from "@/components/cloud-image";
import { ComprarButton } from "./comprar-button";
import type { PrendaVista } from "@/lib/queries";
import { ESTADO_LABEL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const ESTADO_CLASE = {
  DISPONIBLE: "bg-primary text-primary-foreground",
  SEPARADO: "bg-ambar text-black",
  VENDIDO: "bg-zinc-200 text-black",
} as const;

export function PrendaCard({ prenda }: { prenda: PrendaVista }) {
  const vendida = prenda.estado === "VENDIDO";

  return (
    <Card className="gap-0 overflow-hidden p-0 ring-0 border">
      <Link href={`/prenda/${prenda.id}`} className="group relative block aspect-[4/5] overflow-hidden bg-muted">
        <CloudImage
          src={prenda.fotos[0]}
          alt={prenda.nombre}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-300 group-hover:scale-105",
            vendida && "grayscale",
          )}
        />
        <Badge className={cn("absolute left-2 top-2 border-0 font-semibold uppercase", ESTADO_CLASE[prenda.estado])}>
          {ESTADO_LABEL[prenda.estado]}
        </Badge>
        {prenda.nueva && prenda.estado === "DISPONIBLE" && (
          <Badge variant="secondary" className="absolute right-2 top-2 uppercase">
            Nuevo
          </Badge>
        )}
        {vendida && (
          <span className="absolute inset-0 grid place-items-center bg-black/40">
            <span className="-rotate-12 border-2 border-white px-3 py-1 font-display text-xl uppercase text-white">
              Agotado
            </span>
          </span>
        )}
        <span className="absolute bottom-2 left-2 rounded-md bg-background px-2 py-1 font-display text-lg leading-none">
          S/ {prenda.precio.toFixed(0)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
            {prenda.marca} · Talla {prenda.talla}
          </p>
          <Link href={`/prenda/${prenda.id}`} className="line-clamp-2 text-sm font-medium leading-snug">
            {prenda.nombre}
          </Link>
        </div>
        <ComprarButton prenda={prenda} className="mt-auto [&>a]:h-9 [&>a]:text-xs" />
      </div>
    </Card>
  );
}
