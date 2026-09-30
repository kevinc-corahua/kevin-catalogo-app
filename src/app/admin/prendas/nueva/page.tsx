import { PrendaForm } from "@/components/admin/prenda-form";
import { obtenerOpciones } from "@/lib/queries";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Nueva prenda", robots: { index: false } };

export default async function NuevaPrenda() {
  await requireAdmin();
  const opciones = await obtenerOpciones();
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Nueva prenda</h1>
      <PrendaForm opciones={opciones} />
    </main>
  );
}
