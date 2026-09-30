import type { Estado } from "@/generated/prisma/enums";

export function whatsappUrl(
  prenda: { id: string; codigo: string; nombre: string; precio: number },
  accion: "comprar" | "separar",
) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const texto =
    `Hola, me interesa ${accion} esta prenda: ${prenda.nombre} ` +
    `(código ${prenda.codigo}) – S/ ${prenda.precio.toFixed(2)}\n${site}/prenda/${prenda.id}`;
  return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

export const ESTADO_LABEL: Record<Estado, string> = {
  DISPONIBLE: "Disponible",
  SEPARADO: "Separado",
  VENDIDO: "Agotado",
};
