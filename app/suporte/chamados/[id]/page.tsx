import { redirect, notFound } from "next/navigation";
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
      <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-[#0d131f] p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-white mb-2">Acesso Indisponível</h1>
          <p className="text-xs text-slate-400 mb-6">
            {res.error || "O chamado solicitado não foi encontrado ou você não possui permissão para visualizá-lo."}
          </p>
          <Link
            href="/suporte/chamados"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 w-full"
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
