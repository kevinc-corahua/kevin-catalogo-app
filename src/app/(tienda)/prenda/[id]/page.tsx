import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ComprarButton } from "@/components/catalogo/comprar-button";
import { Galeria } from "@/components/catalogo/galeria";
import { obtenerPrenda } from "@/lib/queries";
import { ESTADO_LABEL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const CONDICION = { COMO_NUEVA: "Como nueva", BUENA: "Buena", CON_DETALLE: "Con detalle" } as const;
const ESTADO_CLASE = {
  DISPONIBLE: "bg-primary text-primary-foreground",
  SEPARADO: "bg-ambar text-black",
  VENDIDO: "bg-zinc-200 text-black",
} as const;

export async function generateMetadata({ params }: PageProps<"/prenda/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = await obtenerPrenda(id);
  if (!p) return {};
  const img = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,c_fill,w_1200,h_630/${p.fotos[0]}`;
  return {
    title: p.nombre,
    description: `${p.marca} · Talla ${p.talla} · S/ ${p.precio.toFixed(2)}`,
    openGraph: { images: [img] },
  };
}

export default async function PrendaPage({ params }: PageProps<"/prenda/[id]">) {
  const { id } = await params;
  const p = await obtenerPrenda(id);
  if (!p) notFound();
  const m = p.medidas;

  const datos: [string, string][] = [
    ["Marca", p.marca],
    ["Tipo", p.tipo],
    ["Género", p.genero],
    ["Talla", p.talla],
    ["Condición", CONDICION[p.condicion]],
  ];
  const medidas: [string, number | undefined][] = [
    ["Pecho", m.pecho],
    ["Largo", m.largo],
    ["Cintura", m.cintura],
  ];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-28 md:pb-10">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Volver al catálogo
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <Galeria fotos={p.fotos} alt={p.nombre} agotada={p.estado === "VENDIDO"} />

        <div className="space-y-5">
          <div>
            <Badge className={cn("border-0 font-semibold uppercase", ESTADO_CLASE[p.estado])}>
              {ESTADO_LABEL[p.estado]}
            </Badge>
            <h1 className="mt-3 font-display text-3xl uppercase leading-none sm:text-4xl">{p.nombre}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Código {p.codigo}</p>
          </div>

          <p className="font-display text-4xl text-primary">S/ {p.precio.toFixed(2)}</p>

          <Card className="gap-0 p-0">
            <dl className="divide-y text-sm">
              {datos.map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-2.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
              {medidas.map(
                ([k, v]) =>
                  v && (
                    <div key={k} className="flex justify-between px-4 py-2.5">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v} cm</dd>
                    </div>
                  ),
              )}
            </dl>
          </Card>

          {p.detalles && (
            <p className="rounded-lg border border-ambar/40 bg-ambar/10 p-3 text-sm">
              <span className="font-semibold">Detalles:</span> {p.detalles}
            </p>
          )}
          {p.descripcion && <p className="text-sm leading-relaxed text-muted-foreground">{p.descripcion}</p>}

          <div className="hidden md:block">
            <ComprarButton prenda={p} className="[&>a]:h-11" />
          </div>
        </div>
      </div>

      {/* Barra fija inferior solo en celular */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <p className="font-display text-2xl">S/ {p.precio.toFixed(0)}</p>
          <ComprarButton prenda={p} className="flex-1 [&>a]:h-11" />
        </div>
      </div>
    </main>
  );
}
