import { Suspense } from "react";
import { Filtros } from "@/components/catalogo/filtros";
import { PrendaCard } from "@/components/catalogo/prenda-card";
import { listarPublico, obtenerOpciones, type Filtros as FiltrosDB } from "@/lib/queries";

const num = (v: string | string[] | undefined) => {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
};
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function Home({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const orden = str(sp.orden);
  const filtros: FiltrosDB = {
    tipo: num(sp.tipo),
    genero: num(sp.genero),
    talla: num(sp.talla),
    marca: num(sp.marca),
    q: str(sp.q)?.slice(0, 60),
    orden: orden === "precio-asc" || orden === "precio-desc" ? orden : undefined,
  };
  const [prendas, opciones] = await Promise.all([listarPublico(filtros), obtenerOpciones()]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Ropa americana</h1>
        <p className="text-sm text-muted-foreground">
          Prendas únicas de segunda mano. Elige la tuya y escríbenos por WhatsApp.
        </p>
      </header>

      <Suspense>
        <Filtros {...opciones} />
      </Suspense>

      {prendas.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No hay prendas con esos filtros.
        </p>
      ) : (
        <>
          <p className="mt-4 text-sm text-muted-foreground">{prendas.length} prendas</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {prendas.map((p) => (
              <PrendaCard key={p.id} prenda={p} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
