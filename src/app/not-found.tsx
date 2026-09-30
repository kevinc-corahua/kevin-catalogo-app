import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-7xl text-primary">404</p>
      <p className="text-muted-foreground">Esta página no existe.</p>
      <Link href="/" className={buttonVariants()}>
        Ir al catálogo
      </Link>
    </main>
  );
}
