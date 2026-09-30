import type { Metadata } from "next";
import { Archivo_Black, Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { TIENDA } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const archivo = Archivo_Black({
  variable: "--font-archivo",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${TIENDA} · Ropa americana`, template: `%s | ${TIENDA}` },
  description: "Ropa americana de segunda mano, prenda por prenda. Compra o separa por WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster richColors position="top-center" theme="dark" />
      </body>
    </html>
  );
}
