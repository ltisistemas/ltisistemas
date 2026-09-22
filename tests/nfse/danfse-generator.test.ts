import { describe, it, expect } from "vitest";
import {
  renderDanfseHtml,
  formatDocument,
  formatCurrencyBRL,
  formatDateTimeBR,
  DanfseRenderData,
} from "@/lib/services/nfse/danfse-generator";

describe("danfse-generator", () => {
  it("should format CPF and CNPJ correctly", () => {
    expect(formatDocument("52998224725")).toBe("529.982.247-25");
    expect(formatDocument("06990590000123")).toBe("06.990.590/0001-23");
  });

  it("should format currency in BRL", () => {
    const formatted = formatCurrencyBRL(1250.5);
    expect(formatted).toContain("1.250,50");
  });

  it("should render full DANFSE HTML document containing all blocks and keys", () => {
    const mockData: DanfseRenderData = {
      numeroNfse: "1055",
      chaveAcesso: "26116062560010000010052609069905900001231234567891",
      codigoVerificacao: "A9B2-C4D8",
      dataEmissao: new Date("2026-09-22T14:30:00Z"),
      dataCompetencia: "2026-09",
      status: "AUTORIZADA",
      prestador: {
        razaoSocial: "LTI SISTEMAS LTDA",
        cnpj: "06990590000123",
        inscricaoMunicipal: "123456",
        codigoMunicipio: "2611606",
        municipioNome: "Recife",
        uf: "PE",
        optanteSimples: true,
      },
      tomador: {
        razaoSocial: "EMPRESA CLIENTE S.A.",
        cpfCnpj: "52998224725",
        email: "financeiro@cliente.com",
      },
      servico: {
        codigoLc116: "01.07",
        discriminacao: "Serviços de desenvolvimento e manutenção de software",
      },
      valores: {
        valorServicos: 3500.0,
        aliquotaIss: 2.0,
        valorIss: 70.0,
        issRetido: false,
        valorLiquido: 3500.0,
      },
    };

    const html = renderDanfseHtml(mockData);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("DANFSE — Documento Auxiliar da NFS-e");
    expect(html).toContain("1055");
    expect(html).toContain("26116062560010000010052609069905900001231234567891");
    expect(html).toContain("A9B2-C4D8");
    expect(html).toContain("LTI SISTEMAS LTDA");
    expect(html).toContain("06.990.590/0001-23");
    expect(html).toContain("EMPRESA CLIENTE S.A.");
    expect(html).toContain("529.982.247-25");
    expect(html).toContain("01.07");
    expect(html).toContain("3.500,00");
    expect(html).toContain("70,00");
    expect(html).toContain("STATUS: AUTORIZADA");
  });
});
