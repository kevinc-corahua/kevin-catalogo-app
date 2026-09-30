"use client";

import Image, { type ImageProps } from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary";

export function CloudImage({ alt, ...props }: Omit<ImageProps, "loader">) {
  return <Image alt={alt} {...props} loader={cloudinaryLoader} />;
}
