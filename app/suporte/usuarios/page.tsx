import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { listUsersAction } from "@/lib/actions/auth-actions";
import { UsersClientView } from "@/components/suporte/UsersClientView";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const session = await getSession();

  if (!session) {
    redirect("/suporte/login");
  }

  // Only SUPORTE role can access the users management page
  if (session.role !== "SUPORTE") {
    redirect("/suporte/chamados");
  }

  const res = await listUsersAction();
  const users = res.success && res.data ? res.data : [];

  return (
    <UsersClientView
      user={session}
      initialUsers={users}
    />
  );
}
