import { notFound } from "next/navigation";
import { PrendaForm } from "@/components/admin/prenda-form";
import { obtenerOpciones, obtenerPrenda } from "@/lib/queries";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Editar prenda", robots: { index: false } };

export default async function EditarPrenda({ params }: PageProps<"/admin/prendas/[id]/editar">) {
  await requireAdmin();
  const { id } = await params;
  const [prenda, opciones] = await Promise.all([obtenerPrenda(id), obtenerOpciones()]);
  if (!prenda) notFound();
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Editar {prenda.codigo}</h1>
      <PrendaForm opciones={opciones} prenda={prenda} />
    </main>
  );
}
