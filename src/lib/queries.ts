import { db } from "./db";
import type { Prisma } from "@/generated/prisma/client";
import type { Estado } from "@/generated/prisma/enums";

export type Filtros = {
  tipo?: number;
  genero?: number;
  talla?: number;
  marca?: number;
  q?: string;
  orden?: "recientes" | "precio-asc" | "precio-desc";
};

const include = { tipo: true, genero: true, talla: true, marca: true } as const;

type PrendaDB = Prisma.PrendaGetPayload<{ include: typeof include }>;

export function serializar(p: PrendaDB) {
  return {
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: Number(p.precio),
    estado: p.estado,
    separadoHasta: p.separadoHasta?.toISOString() ?? null,
    condicion: p.condicion,
    detalles: p.detalles,
    medidas: (p.medidas ?? {}) as { pecho?: number; largo?: number; cintura?: number },
    fotos: p.fotos,
    tipo: p.tipo.nombre,
    genero: p.genero.nombre,
    talla: p.talla.nombre,
    marca: p.marca.nombre,
    tipoId: p.tipoId,
    generoId: p.generoId,
    tallaId: p.tallaId,
    marcaId: p.marcaId,
    createdAt: p.createdAt.toISOString(),
    nueva: Date.now() - p.createdAt.getTime() < 7 * 86400_000,
  };
}
export type PrendaVista = ReturnType<typeof serializar>;

// Los vendidos se muestran como "Agotado" durante 14 días y luego se ocultan.
const DIAS_VENDIDO_VISIBLE = 14;

export async function listarPublico(f: Filtros) {
  const desde = new Date(Date.now() - DIAS_VENDIDO_VISIBLE * 86400_000);
  const where: Prisma.PrendaWhereInput = {
    deletedAt: null,
    OR: [{ estado: { not: "VENDIDO" } }, { vendidoAt: { gte: desde } }],
    ...(f.tipo && { tipoId: f.tipo }),
    ...(f.genero && { generoId: f.genero }),
    ...(f.talla && { tallaId: f.talla }),
    ...(f.marca && { marcaId: f.marca }),
    ...(f.q && {
      AND: [
        {
          OR: [
            { nombre: { contains: f.q, mode: "insensitive" } },
            { codigo: { contains: f.q, mode: "insensitive" } },
          ],
        },
      ],
    }),
  };
  const orderBy: Prisma.PrendaOrderByWithRelationInput[] =
    f.orden === "precio-asc"
      ? [{ precio: "asc" }]
      : f.orden === "precio-desc"
        ? [{ precio: "desc" }]
        : [{ createdAt: "desc" }];
  const rows = await db.prenda.findMany({ where, orderBy, include, take: 120 });
  // Disponibles primero, manteniendo el orden elegido dentro de cada grupo
  const rank: Record<Estado, number> = { DISPONIBLE: 0, SEPARADO: 1, VENDIDO: 2 };
  return rows.map(serializar).sort((a, b) => rank[a.estado] - rank[b.estado]);
}

export async function obtenerPrenda(id: string) {
  const p = await db.prenda.findFirst({ where: { id, deletedAt: null }, include });
  return p ? serializar(p) : null;
}

export async function listarAdmin() {
  const rows = await db.prenda.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include,
  });
  return rows.map(serializar);
}

export async function obtenerOpciones() {
  const [tipos, generos, tallas, marcas] = await Promise.all([
    db.tipo.findMany({ orderBy: { nombre: "asc" } }),
    db.genero.findMany({ orderBy: { id: "asc" } }),
    db.talla.findMany({ orderBy: [{ orden: "asc" }, { nombre: "asc" }] }),
    db.marca.findMany({ orderBy: { nombre: "asc" } }),
  ]);
  return { tipos, generos, tallas, marcas };
}

/** Conteos globales para la cabecera del catálogo. */
export async function resumenPublico() {
  const rows = await db.prenda.groupBy({
    by: ["estado"],
    where: { deletedAt: null },
    _count: { _all: true },
  });
  const n = (e: Estado) => rows.find((r) => r.estado === e)?._count._all ?? 0;
  return { disponibles: n("DISPONIBLE"), separadas: n("SEPARADO") };
}
