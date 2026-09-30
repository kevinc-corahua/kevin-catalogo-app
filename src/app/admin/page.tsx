import Link from "next/link";
import { logout } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { FilaPrenda } from "@/components/admin/fila-prenda";
import { listarAdmin } from "@/lib/queries";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Panel", robots: { index: false, follow: false } };

export default async function AdminPage() {
  await requireAdmin();
  const prendas = await listarAdmin();
  const count = (e: string) => prendas.filter((p) => p.estado === e).length;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Panel</h1>
        <div className="flex gap-2">
          <Link href="/admin/prendas/nueva" className={buttonVariants()}>
            + Nueva prenda
          </Link>
          <form action={logout}>
            <Button variant="outline" type="submit">
              Salir
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg border p-3"><p className="text-2xl font-semibold">{count("DISPONIBLE")}</p>Disponibles</div>
        <div className="rounded-lg border p-3"><p className="text-2xl font-semibold">{count("SEPARADO")}</p>Separadas</div>
        <div className="rounded-lg border p-3"><p className="text-2xl font-semibold">{count("VENDIDO")}</p>Vendidas</div>
      </div>

      <div className="mt-6 divide-y rounded-xl border">
        {prendas.length === 0 && <p className="p-6 text-center text-muted-foreground">Aún no hay prendas.</p>}
        {prendas.map((p) => (
          <FilaPrenda key={p.id} prenda={p} />
        ))}
      </div>
    </main>
  );
}
