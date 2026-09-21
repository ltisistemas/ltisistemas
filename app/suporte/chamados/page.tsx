import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTicketsAction } from "@/lib/actions/ticket-actions";
import { listUsersAction } from "@/lib/actions/auth-actions";
import { TicketsClientView } from "@/components/suporte/TicketsClientView";

export const dynamic = "force-dynamic";

export default async function ChamadosPage() {
  const session = await getSession();

  if (!session) {
    redirect("/suporte/login");
  }

  const [resTickets, resUsers] = await Promise.all([
    getTicketsAction("ALL"),
    session.role === "SUPORTE" ? listUsersAction() : Promise.resolve({ success: true, data: [] }),
  ]);

  const tickets = resTickets.success && resTickets.data ? resTickets.data.tickets : [];
  const stats = resTickets.success && resTickets.data ? resTickets.data.stats : { total: 0, aberto: 0, pendente: 0, fechado: 0 };
  const clients =
    resUsers.success && resUsers.data
      ? resUsers.data
          .filter((u) => u.role === "CLIENTE")
          .map((u) => ({
            id: u.id,
            name: u.name,
            company: u.company,
            email: u.email,
          }))
      : [];

  return (
    <TicketsClientView
      user={session}
      initialTickets={tickets}
      initialStats={stats}
      clients={clients}
    />
  );
}
