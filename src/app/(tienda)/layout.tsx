import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { TIENDA, TIKTOK_URL, WHATSAPP_URL } from "@/lib/site";

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
          <Link href="/" aria-label={TIENDA}>
            <Image src="/logokevin.jpeg" alt={TIENDA} width={1129} height={390} priority className="h-9 w-auto" />
          </Link>
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
              © {new Date().getFullYear()} {TIENDA}
            </p>
            {TIKTOK_URL && (
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                TikTok
              </a>
            )}
          </div>
        </div>
      </footer>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      >
        <svg viewBox="0 0 32 32" className="size-8" fill="currentColor" aria-hidden="true">
          <path d="M16.003 3C8.83 3 3 8.83 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.7-1.71A12.95 12.95 0 0 0 16.003 29C23.17 29 29 23.17 29 16S23.17 3 16.003 3Zm0 23.7c-1.95 0-3.86-.53-5.53-1.52l-.4-.24-3.98 1.02 1.06-3.88-.26-.4A10.66 10.66 0 0 1 5.3 16c0-5.9 4.8-10.7 10.7-10.7S26.7 10.1 26.7 16s-4.8 10.7-10.7 10.7Zm5.87-8c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.73.16-.21.32-.83 1.04-1.02 1.26-.19.21-.37.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.3 3.3c.16.21 2.25 3.44 5.46 4.82.76.33 1.36.52 1.82.67.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </a>
    </>
  );
}
