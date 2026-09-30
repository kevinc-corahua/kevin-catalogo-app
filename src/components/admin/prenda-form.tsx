"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { crearOpcion, crearPrenda, editarPrenda } from "@/actions/prendas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubirFotos } from "./subir-fotos";
import type { PrendaVista } from "@/lib/queries";

type Op = { id: number; nombre: string };
type Opciones = { tipos: Op[]; generos: Op[]; tallas: Op[]; marcas: Op[] };

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function PrendaForm({ opciones, prenda }: { opciones: Opciones; prenda?: PrendaVista }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [fotos, setFotos] = useState<string[]>(prenda?.fotos ?? []);
  const [ops, setOps] = useState(opciones);

  const agregarOpcion = async (tabla: "marca" | "tipo" | "talla", key: keyof Opciones) => {
    const nombre = window.prompt(`Nombre de la nueva ${tabla}`);
    if (!nombre) return;
    const r = await crearOpcion(tabla, nombre);
    if ("error" in r) return toast.error(r.error);
    setOps((o) => (o[key].some((x) => x.id === r.opcion.id) ? o : { ...o, [key]: [...o[key], r.opcion] }));
    toast.success("Agregada, selecciónala en la lista");
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    start(async () => {
      const input = { ...fd, fotos };
      const r = prenda ? await editarPrenda(prenda.id, input) : await crearPrenda(input);
      if ("error" in r) {
        toast.error(r.error);
        return;
      }
      toast.success(prenda ? "Prenda actualizada" : "Prenda creada");
      router.push("/admin");
    });
  };

  const sel = (name: string, label: string, list: Op[], def?: number, nueva?: () => void) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name}>{label}</Label>
        {nueva && (
          <button type="button" onClick={nueva} className="text-xs text-muted-foreground underline">
            + nueva
          </button>
        )}
      </div>
      <select id={name} name={name} defaultValue={def ?? ""} required className={selectClass}>
        <option value="" disabled>Elegir…</option>
        {list.map((o) => (
          <option key={o.id} value={o.id}>{o.nombre}</option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Fotos (la primera es la portada)</Label>
        <SubirFotos value={fotos} onChange={setFotos} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" defaultValue={prenda?.nombre} placeholder="Polo Nike vintage" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sel("tipoId", "Tipo", ops.tipos, prenda?.tipoId, () => agregarOpcion("tipo", "tipos"))}
        {sel("generoId", "Género", ops.generos, prenda?.generoId)}
        {sel("tallaId", "Talla", ops.tallas, prenda?.tallaId, () => agregarOpcion("talla", "tallas"))}
        {sel("marcaId", "Marca", ops.marcas, prenda?.marcaId, () => agregarOpcion("marca", "marcas"))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="precio">Precio (S/)</Label>
          <Input id="precio" name="precio" type="number" step="0.01" min="0" inputMode="decimal" defaultValue={prenda?.precio} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condicion">Condición</Label>
          <select id="condicion" name="condicion" defaultValue={prenda?.condicion ?? "BUENA"} className={selectClass}>
            <option value="COMO_NUEVA">Como nueva</option>
            <option value="BUENA">Buena</option>
            <option value="CON_DETALLE">Con detalle</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(["pecho", "largo", "cintura"] as const).map((m) => (
          <div key={m} className="space-y-2">
            <Label htmlFor={m} className="capitalize">{m} (cm)</Label>
            <Input id={m} name={m} type="number" step="0.5" min="0" inputMode="decimal" defaultValue={prenda?.medidas[m]} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="detalles">Detalles / defectos (opcional)</Label>
        <Input id="detalles" name="detalles" defaultValue={prenda?.detalles ?? ""} placeholder="Pequeña mancha en la manga" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción (opcional)</Label>
        <Textarea id="descripcion" name="descripcion" rows={3} defaultValue={prenda?.descripcion ?? ""} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>{pending ? "Guardando…" : "Guardar"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin")}>Cancelar</Button>
      </div>
    </form>
  );
}
