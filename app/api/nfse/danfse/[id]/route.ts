import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getDanfseDataAction } from "@/lib/actions/nfse-actions";
import { renderDanfseHtml } from "@/lib/services/nfse/danfse-generator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const format = req.nextUrl.searchParams.get("format");

    const invoice = await prisma.nfseInvoice.findFirst({
      where: {
        OR: [{ id }, { chaveAcesso: id }, { numeroNfse: id }],
      },
    });

    if (!invoice) {
      return new NextResponse("NFS-e não encontrada.", { status: 404 });
    }

    if (format === "xml") {
      const xmlContent = invoice.xmlRetorno || invoice.xmlEnviado || "<xml>Não disponível</xml>";
      return new NextResponse(xmlContent, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Content-Disposition": `attachment; filename="NFSe_${invoice.numeroNfse || invoice.id}.xml"`,
        },
      });
    }

    const danfseRes = await getDanfseDataAction(invoice.id);
    if (!danfseRes.success || !danfseRes.data) {
      return new NextResponse(danfseRes.error || "Erro ao gerar visualização do DANFSE.", {
        status: 400,
      });
    }

    const html = renderDanfseHtml(danfseRes.data);
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message || "Erro interno ao processar DANFSE.", {
      status: 500,
    });
  }
}
