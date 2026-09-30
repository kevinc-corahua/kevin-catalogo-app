import { config } from "dotenv";
config({ path: ".env.local" });
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Define ADMIN_EMAIL y ADMIN_PASSWORD");
  const passwordHash = await bcrypt.hash(password, 12);
  await db.admin.upsert({ where: { email }, create: { email, passwordHash }, update: { passwordHash } });

  for (const nombre of ["Hombre", "Mujer", "Unisex", "Niño/a"]) {
    await db.genero.upsert({ where: { nombre }, create: { nombre }, update: {} });
  }
  for (const nombre of ["Polo", "Camisa", "Casaca", "Polera", "Jean", "Pantalón", "Short", "Vestido", "Falda", "Zapatillas", "Gorra"]) {
    await db.tipo.upsert({ where: { nombre }, create: { nombre }, update: {} });
  }
  for (const [orden, nombre] of ["XS", "S", "M", "L", "XL", "XXL", "Única"].entries()) {
    await db.talla.upsert({ where: { nombre }, create: { nombre, orden }, update: {} });
  }
  for (const nombre of ["Nike", "Adidas", "Levi's", "Tommy Hilfiger", "Ralph Lauren", "Zara", "H&M", "Otra"]) {
    await db.marca.upsert({ where: { nombre }, create: { nombre }, update: {} });
  }
  console.log("Seed listo");
}

main().finally(() => db.$disconnect());
