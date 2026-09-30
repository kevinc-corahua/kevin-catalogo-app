"use client";

import Image, { type ImageProps } from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary";

export function CloudImage(props: Omit<ImageProps, "loader">) {
  return <Image {...props} loader={cloudinaryLoader} />;
}
