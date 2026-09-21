import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { listUsersAction } from "@/lib/actions/auth-actions";
import { getPortfolioSummaryAction } from "@/lib/actions/commercial-actions";
import { UsersClientView } from "@/components/suporte/UsersClientView";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const session = await getSession();

  if (!session) {
    redirect("/suporte/login");
  }

  // Apenas o papel SUPORTE pode acessar a gestão de usuários e comercial
  if (session.role !== "SUPORTE") {
    redirect("/suporte/chamados");
  }

  const [resUsers, resPortfolio] = await Promise.all([
    listUsersAction(),
    getPortfolioSummaryAction(),
  ]);

  const users = resUsers.success && resUsers.data ? resUsers.data : [];
  const portfolio = resPortfolio.success && resPortfolio.data ? resPortfolio.data : null;

  return (
    <UsersClientView
      user={session}
      initialUsers={users}
      initialPortfolio={portfolio}
    />
  );
}
