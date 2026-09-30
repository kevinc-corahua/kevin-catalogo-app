"use client";

import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CloudImage } from "@/components/cloud-image";

async function subir(file: File): Promise<string> {
  const comprimida = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true });
  const firma = await fetch("/api/cloudinary/sign", { method: "POST" });
  if (!firma.ok) throw new Error("No autorizado");
  const { timestamp, folder, signature, apiKey, cloudName } = await firma.json();
  const fd = new FormData();
  fd.append("file", comprimida);
  fd.append("api_key", apiKey);
  fd.append("timestamp", String(timestamp));
  fd.append("folder", folder);
  fd.append("signature", signature);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
  if (!res.ok) throw new Error("Falló la subida");
  const data = await res.json();
  return data.public_id as string;
}

export function SubirFotos({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setSubiendo(true);
    try {
      const nuevas: string[] = [];
      for (const f of Array.from(files).slice(0, 8 - value.length)) nuevas.push(await subir(f));
      onChange([...value, ...nuevas]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setSubiendo(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2">
        {value.map((id, i) => (
          <div key={id} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <CloudImage src={id} alt="" fill sizes="25vw" className="object-cover" />
            {i === 0 && <span className="absolute left-1 top-1 rounded bg-black/70 px-1 text-[10px] text-white">Portada</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 text-xs text-white">
              <button type="button" className="px-2 py-1" disabled={i === 0} onClick={() => {
                const c = [...value]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; onChange(c);
              }}>←</button>
              <button type="button" className="px-2 py-1" onClick={() => onChange(value.filter((x) => x !== id))}>✕</button>
            </div>
          </div>
        ))}
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      <Button type="button" variant="outline" disabled={subiendo || value.length >= 8} onClick={() => input.current?.click()}>
        {subiendo ? "Subiendo…" : "Agregar fotos"}
      </Button>
    </div>
  );
}
