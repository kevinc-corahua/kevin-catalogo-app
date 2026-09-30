import { v2 as cloudinary } from "cloudinary";
import { getSession } from "@/lib/session";

export async function POST() {
  if (!(await getSession())) return new Response("No autorizado", { status: 401 });
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "kevin-catalogo";
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!,
  );
  return Response.json({
    timestamp,
    folder,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  });
}
