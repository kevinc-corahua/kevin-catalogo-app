import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TIENDA, TIKTOK_URL, WHATSAPP_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const PASOS = [
  { n: "01", t: "Elige tu prenda", d: "Cada una es única: si ya no está, se fue." },
  { n: "02", t: "Toca Comprar o Separar", d: "Se abre WhatsApp con el mensaje listo." },
  { n: "03", t: "Coordinamos", d: "Acordamos pago y entrega por el chat." },
];

export default function TiendaLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-display text-xl uppercase tracking-tight">
            {TIENDA}
            <span className="text-primary">.</span>
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            WhatsApp
          </a>
        </div>
      </header>

      <div className="flex flex-1 flex-col">{children}</div>

      <footer className="mt-16 border-t bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <h2 className="font-display text-2xl uppercase">Cómo comprar</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {PASOS.map((p) => (
              <li key={p.n} className="rounded-lg border bg-background p-4">
                <span className="font-display text-2xl text-primary">{p.n}</span>
                <p className="mt-1 font-medium">{p.t}</p>
                <p className="text-sm text-muted-foreground">{p.d}</p>
              </li>
            ))}
          </ol>
          <Separator className="my-8" />
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {TIENDA}. Ropa americana, una por una.
            </p>
            <div className="flex gap-4">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                WhatsApp
              </a>
              {TIKTOK_URL && (
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
