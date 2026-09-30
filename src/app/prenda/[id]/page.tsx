import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CloudImage } from "@/components/cloud-image";
import { ComprarButton } from "@/components/catalogo/comprar-button";
import { obtenerPrenda } from "@/lib/queries";
import { ESTADO_LABEL } from "@/lib/whatsapp";

const CONDICION = { COMO_NUEVA: "Como nueva", BUENA: "Buena", CON_DETALLE: "Con detalle" } as const;

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

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← Volver al catálogo
      </Link>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
            <CloudImage src={p.fotos[0]} alt={p.nombre} fill priority sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </div>
          {p.fotos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {p.fotos.slice(1).map((f) => (
                <div key={f} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <CloudImage src={f} alt={p.nombre} fill sizes="12vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Badge variant="secondary">{ESTADO_LABEL[p.estado]}</Badge>
            <h1 className="mt-2 text-2xl font-bold">{p.nombre}</h1>
            <p className="text-sm text-muted-foreground">Código {p.codigo}</p>
          </div>
          <p className="text-3xl font-semibold">S/ {p.precio.toFixed(2)}</p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Marca</dt><dd>{p.marca}</dd>
            <dt className="text-muted-foreground">Tipo</dt><dd>{p.tipo}</dd>
            <dt className="text-muted-foreground">Género</dt><dd>{p.genero}</dd>
            <dt className="text-muted-foreground">Talla</dt><dd>{p.talla}</dd>
            <dt className="text-muted-foreground">Condición</dt><dd>{CONDICION[p.condicion]}</dd>
            {m.pecho && (<><dt className="text-muted-foreground">Pecho</dt><dd>{m.pecho} cm</dd></>)}
            {m.largo && (<><dt className="text-muted-foreground">Largo</dt><dd>{m.largo} cm</dd></>)}
            {m.cintura && (<><dt className="text-muted-foreground">Cintura</dt><dd>{m.cintura} cm</dd></>)}
          </dl>
          {p.detalles && <p className="rounded-lg bg-muted p-3 text-sm">Detalles: {p.detalles}</p>}
          {p.descripcion && <p className="text-sm">{p.descripcion}</p>}
          <ComprarButton prenda={p} />
        </div>
      </div>
    </main>
  );
}
