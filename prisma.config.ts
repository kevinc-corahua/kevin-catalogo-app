import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { defineConfig } from "prisma/config";

// Las migraciones usan la conexión directa de Neon (sin pooler).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL_UNPOOLED"] ?? process.env["DATABASE_URL"],
  },
});
