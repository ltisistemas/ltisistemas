import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function SuporteIndexPage() {
  const session = await getSession();

  if (!session) {
    redirect("/suporte/login");
  }

  if (session.role === "CLIENTE") {
    redirect("/suporte/cliente");
  } else {
    redirect("/suporte/usuarios");
  }
}

