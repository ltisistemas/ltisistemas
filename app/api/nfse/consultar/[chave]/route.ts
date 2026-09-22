import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { consultNfseStatusAction } from "@/lib/actions/nfse-actions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chave: string }> }
) {
  try {
    const { chave } = await params;
    if (!chave) {
      return NextResponse.json({ success: false, error: "Chave ou ID obrigatório." }, { status: 400 });
    }

    const invoice = await prisma.nfseInvoice.findFirst({
      where: {
        OR: [{ id: chave }, { chaveAcesso: chave }, { numeroNfse: chave }],
      },
    });

    if (!invoice) {
      return NextResponse.json({ success: false, error: "NFS-e não encontrada." }, { status: 404 });
    }

    const syncRes = await consultNfseStatusAction(invoice.id);
    return NextResponse.json({
      success: true,
      data: {
        id: invoice.id,
        status: syncRes.data?.status || invoice.status,
        chaveAcesso: invoice.chaveAcesso,
        numeroNfse: invoice.numeroNfse,
        codigoVerificacao: invoice.codigoVerificacao,
        valorLiquido: invoice.valorLiquido,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno ao consultar NFS-e." },
      { status: 500 }
    );
  }
}
