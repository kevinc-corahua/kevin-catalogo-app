import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Filtros } from "@/components/catalogo/filtros";
import { PrendaCard } from "@/components/catalogo/prenda-card";
import {
  listarPublico,
  obtenerOpciones,
  resumenPublico,
  type Filtros as FiltrosDB,
} from "@/lib/queries";

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
  const [prendas, opciones, resumen] = await Promise.all([
    listarPublico(filtros),
    obtenerOpciones(),
    resumenPublico(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <section className="mb-8">
        <h1 className="font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Ropa americana,
          <br />
          piezas <span className="text-primary">únicas</span>
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Una sola prenda de cada una. Si te gusta, escríbenos antes de que vuele.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="bg-primary text-primary-foreground">{resumen.disponibles} disponibles</Badge>
          {resumen.separadas > 0 && <Badge variant="secondary">{resumen.separadas} separadas</Badge>}
        </div>
      </section>

      <Suspense>
        <Filtros {...opciones} />
      </Suspense>

      {prendas.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed py-16 text-center">
          <p className="font-display text-xl uppercase">Nada por aquí</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No hay prendas con esos filtros. Prueba quitando alguno.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-5 text-sm text-muted-foreground">
            {prendas.length} {prendas.length === 1 ? "prenda" : "prendas"}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {prendas.map((p) => (
              <PrendaCard key={p.id} prenda={p} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
