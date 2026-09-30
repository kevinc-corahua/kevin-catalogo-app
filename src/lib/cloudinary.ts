const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/** Loader de next/image: Cloudinary hace el resize y la optimización. */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_${quality ?? "auto"},c_limit,w_${width}/${src}`;
}
