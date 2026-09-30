"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { cambiarEstado, eliminarPrenda } from "@/actions/prendas";
import { Button, buttonVariants } from "@/components/ui/button";
import { CloudImage } from "@/components/cloud-image";
import type { PrendaVista } from "@/lib/queries";
import { ESTADO_LABEL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { Estado } from "@/generated/prisma/enums";

const ESTADOS: Estado[] = ["DISPONIBLE", "SEPARADO", "VENDIDO"];

export function FilaPrenda({ prenda }: { prenda: PrendaVista }) {
  const [pending, start] = useTransition();

  const cambiar = (estado: Estado) => {
    let hasta: string | null = null;
    if (estado === "SEPARADO") {
      const v = window.prompt("¿Separada hasta cuándo? (AAAA-MM-DD, vacío = sin fecha)", "");
      if (v === null) return;
      if (v) {
        const d = new Date(`${v}T23:59:59`);
        if (Number.isNaN(d.getTime())) return toast.error("Fecha inválida");
        hasta = d.toISOString();
      }
    }
    start(async () => {
      await cambiarEstado(prenda.id, estado, hasta);
      toast.success(`${prenda.codigo}: ${ESTADO_LABEL[estado]}`);
    });
  };

  const borrar = () => {
    if (!window.confirm(`¿Eliminar ${prenda.codigo} – ${prenda.nombre}?`)) return;
    start(async () => {
      await eliminarPrenda(prenda.id);
      toast.success("Prenda eliminada");
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        <CloudImage src={prenda.fotos[0]} alt="" fill sizes="64px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{prenda.nombre}</p>
        <p className="text-xs text-muted-foreground">
          {prenda.codigo} · {prenda.marca} · {prenda.talla} · S/ {prenda.precio.toFixed(2)}
        </p>
        {prenda.estado === "SEPARADO" && prenda.separadoHasta && (
          <p className="text-xs text-amber-600">
            Hasta {new Date(prenda.separadoHasta).toLocaleDateString("es-PE")}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {ESTADOS.map((e) => (
          <Button
            key={e}
            size="sm"
            variant={prenda.estado === e ? "default" : "outline"}
            disabled={pending || prenda.estado === e}
            onClick={() => cambiar(e)}
          >
            {ESTADO_LABEL[e]}
          </Button>
        ))}
        <Link
          href={`/admin/prendas/${prenda.id}/editar`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Editar
        </Link>
        <Button size="sm" variant="ghost" className="text-destructive" disabled={pending} onClick={borrar}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}
