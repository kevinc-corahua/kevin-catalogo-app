import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { LoginForm } from "./login-form";

export const metadata = { title: "Acceso", robots: { index: false, follow: false } };

export default async function LoginPage() {
  // Solo accesible por el link secreto (el proxy agrega este header)
  if ((await headers()).get("x-admin-login") !== "1") notFound();
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <LoginForm />
    </main>
  );
}
