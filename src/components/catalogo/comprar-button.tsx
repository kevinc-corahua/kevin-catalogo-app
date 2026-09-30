import { Button, buttonVariants } from "@/components/ui/button";
import type { PrendaVista } from "@/lib/queries";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Comprar / Separar abren WhatsApp con el mensaje ya armado. */
export function ComprarButton({ prenda, className }: { prenda: PrendaVista; className?: string }) {
  if (prenda.estado === "VENDIDO") {
    return (
      <Button disabled className={cn("w-full", className)}>
        Agotado
      </Button>
    );
  }
  if (prenda.estado === "SEPARADO") {
    return (
      <Button disabled variant="secondary" className={cn("w-full", className)}>
        Separado
      </Button>
    );
  }
  return (
    <div className={cn("flex gap-2", className)}>
      <a
        href={whatsappUrl(prenda, "comprar")}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants(), "flex-1 font-semibold")}
      >
        Comprar
      </a>
      <a
        href={whatsappUrl(prenda, "separar")}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Separar
      </a>
    </div>
  );
}
