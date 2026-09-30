import { z } from "zod";

const medida = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : v),
  z.coerce.number().positive().optional(),
);

export const prendaSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa un nombre").max(120),
  descripcion: z.string().trim().max(1000).optional(),
  precio: z.coerce.number().positive("Precio inválido").max(100000),
  condicion: z.enum(["COMO_NUEVA", "BUENA", "CON_DETALLE"]),
  detalles: z.string().trim().max(500).optional(),
  pecho: medida,
  largo: medida,
  cintura: medida,
  tipoId: z.coerce.number().int().positive("Elige un tipo"),
  generoId: z.coerce.number().int().positive("Elige un género"),
  tallaId: z.coerce.number().int().positive("Elige una talla"),
  marcaId: z.coerce.number().int().positive("Elige una marca"),
  fotos: z.array(z.string()).min(1, "Sube al menos una foto").max(8),
});
