"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Op = { id: number; nombre: string };

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

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

  const sel = (key: "tipo" | "genero" | "talla" | "marca", label: string, ops: Op[]) => (
    <select
      aria-label={label}
      className={selectClass}
      value={f[key] ?? ""}
      onChange={(e) => setF({ [key]: e.target.value ? Number(e.target.value) : null })}
    >
      <option value="">{label}</option>
      {ops.map((o) => (
        <option key={o.id} value={o.id}>
          {o.nombre}
        </option>
      ))}
    </select>
  );

  const hayFiltros = Object.values(f).some((v) => v !== null);

  return (
    <div className="space-y-3">
      <Input
        type="search"
        placeholder="Buscar por nombre o código…"
        defaultValue={f.q ?? ""}
        onChange={(e) => setF({ q: e.target.value || null }, { limitUrlUpdates: { method: "debounce", timeMs: 400 } })}
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {sel("tipo", "Tipo", tipos)}
        {sel("genero", "Género", generos)}
        {sel("talla", "Talla", tallas)}
        {sel("marca", "Marca", marcas)}
        <select
          aria-label="Ordenar"
          className={selectClass}
          value={f.orden ?? ""}
          onChange={(e) => setF({ orden: e.target.value || null })}
        >
          <option value="">Más recientes</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
        </select>
      </div>
      {hayFiltros && (
        <Button variant="ghost" size="sm" onClick={() => setF(null)}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
