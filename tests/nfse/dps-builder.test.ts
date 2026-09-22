import { describe, it, expect } from "vitest";
import {
  validateCpf,
  validateCnpj,
  validateCpfCnpj,
  validateDpsParams,
  buildDpsData,
  generateDpsXml,
  sanitizeDocument,
} from "@/lib/services/nfse/dps-builder";

describe("dps-builder", () => {
  // Test Brazilian CPF and CNPJ algorithms
  it("should validate and reject CPF correctly", () => {
    // Known valid test CPFs
    expect(validateCpf("52998224725")).toBe(true);
    expect(validateCpf("529.982.247-25")).toBe(true);
    // Invalid CPFs
    expect(validateCpf("11111111111")).toBe(false);
    expect(validateCpf("12345678900")).toBe(false);
    expect(validateCpf("123")).toBe(false);
  });

  it("should validate and reject CNPJ correctly", () => {
    // Valid test CNPJ
    expect(validateCnpj("06990590000123")).toBe(true); // Google Brasil CNPJ
    expect(validateCnpj("06.990.590/0001-23")).toBe(true);
    expect(validateCnpj("00.000.000/0001-91")).toBe(true); // Banco do Brasil
    // Invalid CNPJs
    expect(validateCnpj("00000000000000")).toBe(false);
    expect(validateCnpj("12345678000199")).toBe(false);
    expect(validateCnpj("123")).toBe(false);
  });

  it("should validate CPF/CNPJ helper", () => {
    expect(validateCpfCnpj("529.982.247-25").type).toBe("CPF");
    expect(validateCpfCnpj("06.990.590/0001-23").type).toBe("CNPJ");
    expect(validateCpfCnpj("12345").valid).toBe(false);
  });

  const validPrestador = {
    cnpj: "06.990.590/0001-23",
    razaoSocial: "LTI SISTEMAS LTDA",
    inscricaoMunicipal: "1234567",
    codigoMunicipio: "2611606", // Recife
    optanteSimplesNacional: true,
    aliquotaIss: 2.0,
    codigoServicoLc116: "01.07",
  };

  const validTomador = {
    cpfCnpj: "529.982.247-25",
    razaoSocial: "CLIENTE TESTE LTDA",
    email: "cliente@teste.com",
  };

  it("should validate required fields in validateDpsParams", () => {
    const valid = validateDpsParams({
      dpsNumero: "105",
      prestador: validPrestador,
      tomador: validTomador,
      servico: {
        discriminacao: "Manutenção de software mensal e suporte",
      },
      valores: {
        valorServicos: 1500.0,
      },
    });

    expect(valid.valid).toBe(true);
    expect(valid.issues).toHaveLength(0);
  });

  it("should catch invalid fields in validateDpsParams", () => {
    const invalid = validateDpsParams({
      dpsNumero: "105",
      prestador: {
        ...validPrestador,
        cnpj: "invalid",
      },
      tomador: {
        ...validTomador,
        cpfCnpj: "invalid",
      },
      servico: {
        discriminacao: "x",
      },
      valores: {
        valorServicos: 0,
      },
    });

    expect(invalid.valid).toBe(false);
    expect(invalid.issues.length).toBeGreaterThanOrEqual(3);
  });

  it("should build structured DPS and calculate XML correctly", () => {
    const dps = buildDpsData({
      dpsNumero: "105",
      dpsSerie: "1",
      environment: "SIMULADOR",
      prestador: validPrestador,
      tomador: validTomador,
      servico: {
        codigoLc116: "01.07",
        discriminacao: "Desenvolvimento e suporte contínuo de sistemas",
      },
      valores: {
        valorServicos: 2500.0,
        aliquotaIss: 3.0,
        issRetido: false,
      },
    });

    expect(dps.idDps).toContain("DPS2611606");
    expect(dps.valores.valorServicos).toBe(2500.0);
    expect(dps.valores.valorIss).toBe(75.0);
    expect(dps.valores.valorLiquido).toBe(2500.0);

    const xml = generateDpsXml(dps);
    expect(xml).toContain("<DPS xmlns=\"http://www.sped.fazenda.gov.br/nfse\"");
    expect(xml).toContain("<infDPS id=\"DPS2611606");
    expect(xml).toContain("<vServ>2500.00</vServ>");
    expect(xml).toContain("<vISSQN>75.00</vISSQN>");
    expect(xml).toContain("<cTribNac>01.07</cTribNac>");
    expect(xml).toContain("<xNome>CLIENTE TESTE LTDA</xNome>");
  });
});
