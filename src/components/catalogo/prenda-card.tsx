import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CloudImage } from "@/components/cloud-image";
import { ComprarButton } from "./comprar-button";
import type { PrendaVista } from "@/lib/queries";
import { ESTADO_LABEL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const ESTADO_CLASE = {
  DISPONIBLE: "bg-emerald-600 text-white",
  SEPARADO: "bg-amber-500 text-white",
  VENDIDO: "bg-zinc-700 text-white",
} as const;

export function PrendaCard({ prenda }: { prenda: PrendaVista }) {
  const noDisponible = prenda.estado !== "DISPONIBLE";
  return (
    <Card className="overflow-hidden p-0 gap-0">
      <Link href={`/prenda/${prenda.id}`} className="relative block aspect-[4/5] bg-muted">
        <CloudImage
          src={prenda.fotos[0]}
          alt={prenda.nombre}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          className={cn("object-cover", noDisponible && "opacity-60")}
        />
        <Badge className={cn("absolute left-2 top-2 border-0", ESTADO_CLASE[prenda.estado])}>
          {ESTADO_LABEL[prenda.estado]}
        </Badge>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {prenda.marca} · Talla {prenda.talla}
          </p>
          <Link href={`/prenda/${prenda.id}`} className="line-clamp-2 text-sm font-medium leading-tight">
            {prenda.nombre}
          </Link>
        </div>
        <p className="text-lg font-semibold">S/ {prenda.precio.toFixed(2)}</p>
        <ComprarButton prenda={prenda} />
      </div>
    </Card>
  );
}
