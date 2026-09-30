import { Button, buttonVariants } from "@/components/ui/button";
import type { PrendaVista } from "@/lib/queries";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Comprar / Separar abren WhatsApp con el mensaje ya armado. */
export function ComprarButton({ prenda }: { prenda: PrendaVista }) {
  if (prenda.estado === "VENDIDO") {
    return (
      <Button disabled className="w-full">
        Agotado
      </Button>
    );
  }
  if (prenda.estado === "SEPARADO") {
    return (
      <Button disabled variant="secondary" className="w-full">
        Separado
      </Button>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={whatsappUrl(prenda, "comprar")}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants())}
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
