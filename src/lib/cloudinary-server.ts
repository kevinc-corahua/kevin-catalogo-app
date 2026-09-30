import "server-only";
import { v2 as cloudinary } from "cloudinary";

export const CLOUDINARY_FOLDER = "kevin-catalogo";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/** Borra imágenes de Cloudinary. Nunca lanza: un fallo aquí no debe romper el guardado. */
export async function borrarFotos(publicIds: string[]) {
  const ids = publicIds.filter((id) => id.startsWith(`${CLOUDINARY_FOLDER}/`));
  if (ids.length === 0) return;
  try {
    await cloudinary.api.delete_resources(ids, { invalidate: true });
  } catch (e) {
    console.error("No se pudieron borrar fotos de Cloudinary", ids, e);
  }
}
