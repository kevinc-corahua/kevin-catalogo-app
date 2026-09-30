"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { CLOUDINARY_FOLDER, borrarFotos } from "@/lib/cloudinary-server";
import { requireAdmin } from "@/lib/session";
import { prendaSchema } from "@/lib/validators";
import type { Estado } from "@/generated/prisma/enums";

function refrescar(id?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  if (id) revalidatePath(`/prenda/${id}`);
}

function datos(input: unknown) {
  const r = prendaSchema.safeParse(input);
  if (!r.success) return { error: r.error.issues[0].message } as const;
  const { pecho, largo, cintura, descripcion, detalles, ...rest } = r.data;
  return {
    data: {
      ...rest,
      descripcion: descripcion || null,
      detalles: detalles || null,
      medidas: { pecho, largo, cintura },
    },
  } as const;
}

async function siguienteCodigo() {
  const c = await db.contador.upsert({
    where: { id: "prenda" },
    create: { id: "prenda", valor: 1 },
    update: { valor: { increment: 1 } },
  });
  return `KV-${String(c.valor).padStart(4, "0")}`;
}

export async function crearPrenda(input: unknown) {
  await requireAdmin();
  const r = datos(input);
  if ("error" in r) return { error: r.error };
  const p = await db.prenda.create({
    data: {
      ...r.data,
      codigo: await siguienteCodigo(),
      historial: { create: { estado: "DISPONIBLE" } },
    },
  });
  refrescar(p.id);
  return { ok: true as const };
}

export async function editarPrenda(id: string, input: unknown) {
  await requireAdmin();
  const r = datos(input);
  if ("error" in r) return { error: r.error };
  const antes = await db.prenda.findUnique({ where: { id }, select: { fotos: true } });
  await db.prenda.update({ where: { id }, data: r.data });
  // Las fotos que ya no están en la prenda se borran también de Cloudinary
  await borrarFotos((antes?.fotos ?? []).filter((f) => !r.data.fotos.includes(f)));
  refrescar(id);
  return { ok: true as const };
}

export async function cambiarEstado(id: string, estado: Estado, separadoHasta?: string | null) {
  await requireAdmin();
  await db.prenda.update({
    where: { id },
    data: {
      estado,
      separadoHasta: estado === "SEPARADO" && separadoHasta ? new Date(separadoHasta) : null,
      vendidoAt: estado === "VENDIDO" ? new Date() : null,
      historial: { create: { estado } },
    },
  });
  refrescar(id);
}

export async function eliminarPrenda(id: string) {
  await requireAdmin();
  await db.prenda.update({ where: { id }, data: { deletedAt: new Date() } });
  refrescar(id);
}

/** Crea una marca/tipo/talla al vuelo desde el formulario. */
export async function crearOpcion(tabla: "marca" | "tipo" | "talla", nombre: string) {
  await requireAdmin();
  const n = nombre.trim();
  if (!n || n.length > 40) return { error: "Nombre inválido" };
  const o =
    tabla === "marca"
      ? await db.marca.upsert({ where: { nombre: n }, create: { nombre: n }, update: {} })
      : tabla === "tipo"
        ? await db.tipo.upsert({ where: { nombre: n }, create: { nombre: n }, update: {} })
        : await db.talla.upsert({ where: { nombre: n }, create: { nombre: n, orden: 99 }, update: {} });
  return { ok: true as const, opcion: { id: o.id, nombre: o.nombre } };
}

/** Borra una foto recién subida que el admin quitó antes de guardar (no pertenece a ninguna prenda). */
export async function descartarFotoSubida(publicId: string) {
  await requireAdmin();
  if (!publicId.startsWith(`${CLOUDINARY_FOLDER}/`)) return;
  const enUso = await db.prenda.count({ where: { fotos: { has: publicId } } });
  if (enUso === 0) await borrarFotos([publicId]);
}
