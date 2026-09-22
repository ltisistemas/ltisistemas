import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { listUsersAction } from "@/lib/actions/auth-actions";
import { SupportHeader } from "@/components/suporte/SupportHeader";
import { ClientHub360View } from "@/components/suporte/ClientHub360View";

export const dynamic = "force-dynamic";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/suporte/login");
  }

  const { id } = await params;

  // Clientes só podem visualizar seus próprios dados
  if (session.role === "CLIENTE" && session.userId !== id) {
    redirect("/suporte/cliente");
  }

  const resUsers =
    session.role === "SUPORTE"
      ? await listUsersAction()
      : { success: true, data: [] };

  const allClients =
    resUsers.success && resUsers.data
      ? resUsers.data.map((u) => ({
          id: u.id,
          name: u.name,
          company: u.company,
          email: u.email,
          contractNumber: u.contractNumber,
          status: u.status,
        }))
      : [];

  return (
    <div className="min-h-screen bg-[#f3f4f8]">
      <SupportHeader
        user={session}
        activeTab={session.role === "SUPORTE" ? "usuarios" : "cliente"}
        counts={{ clients: allClients.length }}
      />
      <ClientHub360View
        user={session}
        initialClientId={id}
        allClients={allClients}
      />
    </div>
  );
}
