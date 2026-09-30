"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cambiarEstado, eliminarPrenda } from "@/actions/prendas";
import { Button, buttonVariants } from "@/components/ui/button";
import { CloudImage } from "@/components/cloud-image";
import { CampoDialog, ConfirmDialog } from "./dialogos";
import type { PrendaVista } from "@/lib/queries";
import { ESTADO_LABEL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { Estado } from "@/generated/prisma/enums";

const ESTADOS: Estado[] = ["DISPONIBLE", "SEPARADO", "VENDIDO"];

export function FilaPrenda({ prenda }: { prenda: PrendaVista }) {
  const [pending, start] = useTransition();
  const [dialogo, setDialogo] = useState<"separar" | "eliminar" | null>(null);

  const cambiar = (estado: Estado, hasta: string | null = null) => {
    start(async () => {
      await cambiarEstado(prenda.id, estado, hasta);
      setDialogo(null);
      toast.success(`${prenda.codigo}: ${ESTADO_LABEL[estado]}`);
    });
  };

  const separar = (fecha: string) => {
    // Hasta el final del día elegido; vacío = sin fecha límite
    cambiar("SEPARADO", fecha ? new Date(`${fecha}T23:59:59`).toISOString() : null);
  };

  const borrar = () => {
    start(async () => {
      await eliminarPrenda(prenda.id);
      setDialogo(null);
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
          <p className="text-xs text-ambar">
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
            onClick={() => (e === "SEPARADO" ? setDialogo("separar") : cambiar(e))}
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
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive"
          disabled={pending}
          onClick={() => setDialogo("eliminar")}
        >
          Eliminar
        </Button>
      </div>

      <CampoDialog
        open={dialogo === "separar"}
        onOpenChange={(o) => !o && setDialogo(null)}
        titulo={`Separar ${prenda.codigo}`}
        descripcion="Elige hasta qué día queda separada. Déjalo vacío si no hay fecha límite."
        label="Separada hasta"
        type="date"
        opcional
        confirmar="Separar"
        cargando={pending}
        onSubmit={separar}
      />
      <ConfirmDialog
        open={dialogo === "eliminar"}
        onOpenChange={(o) => !o && setDialogo(null)}
        titulo="¿Eliminar esta prenda?"
        descripcion={`${prenda.codigo} – ${prenda.nombre} dejará de mostrarse en el catálogo.`}
        confirmar="Eliminar"
        destructivo
        cargando={pending}
        onConfirm={borrar}
      />
    </div>
  );
}
