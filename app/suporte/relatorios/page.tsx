import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { listUsersAction } from "@/lib/actions/auth-actions";
import { getClientReportAction } from "@/lib/actions/report-actions";
import { ClientReportView } from "@/components/suporte/ClientReportView";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  const session = await getSession();

  if (!session) {
    redirect("/suporte/login");
  }

  // Define o intervalo padrão do mês atual
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startDate = firstDay.toISOString().split("T")[0];
  const endDate = lastDay.toISOString().split("T")[0];

  const [resUsers, resReport] = await Promise.all([
    session.role === "SUPORTE"
      ? listUsersAction()
      : Promise.resolve({ success: true, data: [] }),
    getClientReportAction({
      clientId: session.role === "SUPORTE" ? undefined : session.userId,
      startDate,
      endDate,
    }),
  ]);

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

  const initialReportData =
    resReport.success && resReport.data ? resReport.data : null;

  return (
    <ClientReportView
      user={session}
      clients={clients}
      initialReportData={initialReportData}
      initialClientId={session.role === "SUPORTE" ? "ALL" : session.userId}
      initialStartDate={startDate}
      initialEndDate={endDate}
    />
  );
}
