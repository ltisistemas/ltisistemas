import { describe, it, expect } from "vitest";
import {
  NfseApiClient,
  generateNfseAccessKey,
  generateVerificationCode,
} from "@/lib/services/nfse/nfse-client";
import { buildDpsData } from "@/lib/services/nfse/dps-builder";

describe("nfse-client", () => {
  const validDps = buildDpsData({
    dpsNumero: "201",
    dpsSerie: "1",
    environment: "SIMULADOR",
    prestador: {
      cnpj: "06.990.590/0001-23",
      razaoSocial: "LTI SISTEMAS LTDA",
      inscricaoMunicipal: "987654",
      codigoMunicipio: "2611606",
      optanteSimplesNacional: true,
      aliquotaIss: 2.0,
      codigoServicoLc116: "01.07",
    },
    tomador: {
      cpfCnpj: "529.982.247-25",
      razaoSocial: "CLIENTE TESTE",
      email: "cliente@teste.com",
    },
    servico: {
      discriminacao: "Suporte e monitoramento mensal",
    },
    valores: {
      valorServicos: 1800.0,
    },
  });

  it("should generate valid 50-digit NFS-e access key", () => {
    const key = generateNfseAccessKey(validDps, 1005);
    expect(key).toHaveLength(50);
    expect(key.startsWith("2611606")).toBe(true);
  });

  it("should generate verification code in format XXXX-XXXX", () => {
    const code = generateVerificationCode();
    expect(code).toHaveLength(9);
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it("should emit NFS-e in simulator mode returning authorized status and key", async () => {
    const client = new NfseApiClient({ environment: "SIMULADOR" });
    const res = await client.emitirNfse(validDps);

    expect(res.success).toBe(true);
    expect(res.status).toBe("AUTORIZADA");
    expect(res.chaveAcesso).toBeDefined();
    expect(res.chaveAcesso).toHaveLength(50);
    expect(res.numeroNfse).toBeDefined();
    expect(res.codigoVerificacao).toBeDefined();
    expect(res.xmlEnviado).toContain("<DPS");
    expect(res.xmlRetorno).toContain("<NFSe");
    expect(res.danfseUrl).toContain("/api/nfse/danfse/");
  });

  it("should consult NFS-e status in simulator mode", async () => {
    const client = new NfseApiClient({ environment: "SIMULADOR" });
    const res = await client.consultarNfse("26116062560010000010052406990590000123123456781");

    expect(res.success).toBe(true);
    expect(res.status).toBe("AUTORIZADA");
  });

  it("should cancel NFS-e in simulator mode", async () => {
    const client = new NfseApiClient({ environment: "SIMULADOR" });
    const res = await client.cancelarNfse({
      invoiceId: "inv_123",
      chaveAcesso: "26116062560010000010052406990590000123123456781",
      motivo: "Cancelamento solicitado pelo tomador antes da prestação",
    });

    expect(res.success).toBe(true);
    expect(res.protocolo).toBeDefined();
  });
});
