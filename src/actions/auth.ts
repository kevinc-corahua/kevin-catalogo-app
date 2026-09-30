"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";

const MAX_INTENTOS = 5;
const VENTANA_MS = 15 * 60_000;
// Hash falso para comparar siempre y no revelar si el correo existe
const HASH_FALSO = bcrypt.hashSync("no-existe", 12);

export async function login(
  _: unknown,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const h = await headers();
  // Solo desde la ruta secreta (el proxy pone este header)
  if (h.get("x-admin-login") !== "1") return { error: "No autorizado" };

  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? "desconocida";
  const desde = new Date(Date.now() - VENTANA_MS);
  const intentos = await db.loginIntento.count({ where: { ip, createdAt: { gte: desde } } });
  if (intentos >= MAX_INTENTOS) return { error: "Demasiados intentos. Prueba en 15 minutos." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const admin = await db.admin.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, admin?.passwordHash ?? HASH_FALSO);
  if (!admin || !ok) {
    await db.loginIntento.create({ data: { ip } });
    return { error: "Credenciales incorrectas" };
  }
  await db.loginIntento.deleteMany({ where: { ip } });
  await createSession(admin.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
