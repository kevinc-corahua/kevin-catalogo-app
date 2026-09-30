"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Op = { id: number; nombre: string };
type Clave = "tipo" | "genero" | "talla" | "marca";

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const ORDENES: Record<string, string> = {
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
};

export function Filtros({
  tipos,
  generos,
  tallas,
  marcas,
}: {
  tipos: Op[];
  generos: Op[];
  tallas: Op[];
  marcas: Op[];
}) {
  const [f, setF] = useQueryStates(
    {
      tipo: parseAsInteger,
      genero: parseAsInteger,
      talla: parseAsInteger,
      marca: parseAsInteger,
      q: parseAsString,
      orden: parseAsString,
    },
    { shallow: false },
  );

  const listas: Record<Clave, Op[]> = { tipo: tipos, genero: generos, talla: tallas, marca: marcas };
  const nombre = (k: Clave) => listas[k].find((o) => o.id === f[k])?.nombre;

  const activos = (["tipo", "talla", "marca"] as const).filter((k) => f[k] !== null);
  const nActivos = activos.length + (f.orden ? 1 : 0);

  const chip = (activo: boolean) =>
    cn(
      buttonVariants({ variant: activo ? "default" : "outline", size: "sm" }),
      "shrink-0 rounded-full",
    );

  const sel = (k: "tipo" | "talla" | "marca", label: string) => (
    <div className="space-y-2">
      <Label htmlFor={`f-${k}`}>{label}</Label>
      <select
        id={`f-${k}`}
        className={selectClass}
        value={f[k] ?? ""}
        onChange={(e) => setF({ [k]: e.target.value ? Number(e.target.value) : null })}
      >
        <option value="">Todos</option>
        {listas[k].map((o) => (
          <option key={o.id} value={o.id}>
            {o.nombre}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="search"
          placeholder="Buscar por nombre o código…"
          defaultValue={f.q ?? ""}
          className="h-10"
          onChange={(e) =>
            setF({ q: e.target.value || null }, { limitUrlUpdates: { method: "debounce", timeMs: 400 } })
          }
        />
        <Sheet>
          <SheetTrigger className={cn(buttonVariants({ variant: "outline" }), "h-10 shrink-0")}>
            Filtros{nActivos > 0 && <Badge className="ml-1.5 px-1.5">{nActivos}</Badge>}
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl p-5">
            <SheetHeader className="p-0">
              <SheetTitle className="font-display text-xl uppercase">Filtrar prendas</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              {sel("tipo", "Tipo")}
              {sel("talla", "Talla")}
              {sel("marca", "Marca")}
              <div className="space-y-2">
                <Label htmlFor="f-orden">Ordenar por</Label>
                <select
                  id="f-orden"
                  className={selectClass}
                  value={f.orden ?? ""}
                  onChange={(e) => setF({ orden: e.target.value || null })}
                >
                  <option value="">Más recientes</option>
                  {Object.entries(ORDENES).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setF(null)}>
                Limpiar todo
              </Button>
              <SheetClose className={cn(buttonVariants(), "flex-1")}>Ver prendas</SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Género: chips con scroll horizontal */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        <button type="button" className={chip(f.genero === null)} onClick={() => setF({ genero: null })}>
          Todo
        </button>
        {generos.map((g) => (
          <button key={g.id} type="button" className={chip(f.genero === g.id)} onClick={() => setF({ genero: g.id })}>
            {g.nombre}
          </button>
        ))}
      </div>

      {nActivos > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activos.map((k) => (
            <Badge key={k} variant="secondary" className="gap-1 pr-1">
              {nombre(k)}
              <button
                type="button"
                aria-label={`Quitar filtro ${nombre(k)}`}
                className="rounded px-1 hover:bg-background"
                onClick={() => setF({ [k]: null })}
              >
                ✕
              </button>
            </Badge>
          ))}
          {f.orden && ORDENES[f.orden] && (
            <Badge variant="secondary" className="gap-1 pr-1">
              {ORDENES[f.orden]}
              <button
                type="button"
                aria-label="Quitar orden"
                className="rounded px-1 hover:bg-background"
                onClick={() => setF({ orden: null })}
              >
                ✕
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
