import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getTicketByIdAction } from "@/lib/actions/ticket-actions";
import { TicketDetailClientView } from "@/components/suporte/TicketDetailClientView";

export const dynamic = "force-dynamic";

interface ChamadoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChamadoDetailPage({ params }: ChamadoDetailPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/suporte/login");
  }

  const { id } = await params;
  const res = await getTicketByIdAction(id);

  if (!res.success || !res.data) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#f8d7da] text-[#dc3545] border border-[#f5c2c7] flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Acesso Indisponível</h1>
          <p className="text-xs text-gray-500 mb-6">
            {res.error || "O chamado solicitado não foi encontrado ou você não possui permissão para visualizá-lo."}
          </p>
          <Link
            href="/suporte/chamados"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-colors border border-gray-300 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retornar para Meus Chamados</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <TicketDetailClientView
      user={session}
      initialTicket={res.data}
    />
  );
}
