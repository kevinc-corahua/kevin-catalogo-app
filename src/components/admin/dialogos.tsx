"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Reemplazo de window.confirm. */
export function ConfirmDialog({
  open,
  onOpenChange,
  titulo,
  descripcion,
  confirmar = "Confirmar",
  destructivo = false,
  cargando = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo: string;
  descripcion?: string;
  confirmar?: string;
  destructivo?: boolean;
  cargando?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          {descripcion && <DialogDescription>{descripcion}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={cargando}>
            Cancelar
          </Button>
          <Button variant={destructivo ? "destructive" : "default"} onClick={onConfirm} disabled={cargando}>
            {cargando ? "Procesando…" : confirmar}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Reemplazo de window.prompt: un campo con título. `onSubmit` recibe el valor (vacío si es opcional). */
export function CampoDialog({
  open,
  onOpenChange,
  titulo,
  descripcion,
  label,
  type = "text",
  placeholder,
  opcional = false,
  confirmar = "Guardar",
  cargando = false,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo: string;
  descripcion?: string;
  label: string;
  type?: "text" | "date";
  placeholder?: string;
  opcional?: boolean;
  confirmar?: string;
  cargando?: boolean;
  onSubmit: (valor: string) => void;
}) {
  const [valor, setValor] = useState("");
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setValor("");
        onOpenChange(o);
      }}
    >
      <DialogContent showCloseButton={false}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(valor.trim());
            setValor("");
          }}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>{titulo}</DialogTitle>
            {descripcion && <DialogDescription>{descripcion}</DialogDescription>}
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="campo-dialogo">{label}</Label>
            <Input
              id="campo-dialogo"
              type={type}
              min={type === "date" ? hoy : undefined}
              value={valor}
              placeholder={placeholder}
              required={!opcional}
              autoFocus
              onChange={(e) => setValor(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando}>
              {cargando ? "Guardando…" : confirmar}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
