import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as emitPost } from "@/app/api/nfse/emitir/route";
import { GET as consultGet } from "@/app/api/nfse/consultar/[chave]/route";
import { POST as cancelPost } from "@/app/api/nfse/cancelar/route";
import { GET as danfseGet } from "@/app/api/nfse/danfse/[id]/route";
import * as nfseActions from "@/lib/actions/nfse-actions";
import { prisma } from "@/lib/db/prisma";
import { NextRequest } from "next/server";

describe("NFS-e API Routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle POST /api/nfse/emitir", async () => {
    vi.spyOn(nfseActions, "emitNfseAction").mockResolvedValue({
      success: true,
      data: {
        id: "inv_123",
        numeroNfse: "1001",
        status: "AUTORIZADA",
      } as any,
    });

    const req = new NextRequest("http://localhost:3000/api/nfse/emitir", {
      method: "POST",
      body: JSON.stringify({ receivableId: "rec_1" }),
    });

    const res = await emitPost(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.numeroNfse).toBe("1001");
  });

  it("should handle GET /api/nfse/consultar/[chave]", async () => {
    vi.spyOn(prisma.nfseInvoice, "findFirst").mockResolvedValue({
      id: "inv_123",
      chaveAcesso: "26116062560010000010052609069905900001231234567891",
      status: "AUTORIZADA",
      numeroNfse: "1001",
      valorLiquido: 1500,
    } as any);

    vi.spyOn(nfseActions, "consultNfseStatusAction").mockResolvedValue({
      success: true,
      data: { status: "AUTORIZADA" },
    });

    const req = new NextRequest("http://localhost:3000/api/nfse/consultar/inv_123");
    const res = await consultGet(req, { params: Promise.resolve({ chave: "inv_123" }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.numeroNfse).toBe("1001");
  });

  it("should handle POST /api/nfse/cancelar", async () => {
    vi.spyOn(nfseActions, "cancelNfseAction").mockResolvedValue({
      success: true,
      data: { success: true },
    });

    const req = new NextRequest("http://localhost:3000/api/nfse/cancelar", {
      method: "POST",
      body: JSON.stringify({ invoiceId: "inv_123", motivo: "Cancelamento" }),
    });

    const res = await cancelPost(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("should handle GET /api/nfse/danfse/[id] for HTML and XML format", async () => {
    vi.spyOn(prisma.nfseInvoice, "findFirst").mockResolvedValue({
      id: "inv_123",
      xmlRetorno: "<NFSe><chNFSe>2611606</chNFSe></NFSe>",
    } as any);

    vi.spyOn(nfseActions, "getDanfseDataAction").mockResolvedValue({
      success: true,
      data: {
        numeroNfse: "1001",
        chaveAcesso: "2611606",
        codigoVerificacao: "A1B2",
        dataEmissao: new Date(),
        dataCompetencia: "2026-09",
        status: "AUTORIZADA",
        prestador: {
          razaoSocial: "LTI SISTEMAS",
          cnpj: "06990590000123",
          inscricaoMunicipal: "123",
          codigoMunicipio: "2611606",
        },
        tomador: {
          razaoSocial: "CLIENTE",
          cpfCnpj: "52998224725",
        },
        servico: {
          codigoLc116: "01.07",
          discriminacao: "Suporte",
        },
        valores: {
          valorServicos: 1000,
          aliquotaIss: 2,
          valorIss: 20,
          issRetido: false,
          valorLiquido: 1000,
        },
      },
    });

    const htmlReq = new NextRequest("http://localhost:3000/api/nfse/danfse/inv_123");
    const htmlRes = await danfseGet(htmlReq, { params: Promise.resolve({ id: "inv_123" }) });
    expect(htmlRes.status).toBe(200);
    expect(htmlRes.headers.get("Content-Type")).toContain("text/html");

    const xmlReq = new NextRequest("http://localhost:3000/api/nfse/danfse/inv_123?format=xml");
    const xmlRes = await danfseGet(xmlReq, { params: Promise.resolve({ id: "inv_123" }) });
    expect(xmlRes.status).toBe(200);
    expect(xmlRes.headers.get("Content-Type")).toContain("application/xml");
  });
});
