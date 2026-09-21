import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTicketsAction } from "@/lib/actions/ticket-actions";
import { TicketsClientView } from "@/components/suporte/TicketsClientView";

export const dynamic = "force-dynamic";

export default async function ChamadosPage() {
  const session = await getSession();

  if (!session) {
    redirect("/suporte/login");
  }

  const res = await getTicketsAction("ALL");
  const tickets = res.success && res.data ? res.data.tickets : [];
  const stats = res.success && res.data ? res.data.stats : { total: 0, aberto: 0, pendente: 0, fechado: 0 };

  return (
    <TicketsClientView
      user={session}
      initialTickets={tickets}
      initialStats={stats}
    />
  );
}
