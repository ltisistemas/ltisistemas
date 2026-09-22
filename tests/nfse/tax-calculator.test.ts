import { describe, it, expect } from "vitest";
import {
  calculateNfseTaxes,
  validateAliquotaIss,
  roundCurrency,
  getLc116Item,
  LC116_SERVICE_CATALOG,
} from "@/lib/services/nfse/tax-calculator";

describe("tax-calculator", () => {
  it("should validate legal ISSQN aliquots between 2.0% and 5.0%", () => {
    expect(validateAliquotaIss(2.0).valid).toBe(true);
    expect(validateAliquotaIss(3.5).valid).toBe(true);
    expect(validateAliquotaIss(5.0).valid).toBe(true);
    expect(validateAliquotaIss(0).valid).toBe(true); // Isenção

    expect(validateAliquotaIss(1.5).valid).toBe(false);
    expect(validateAliquotaIss(5.5).valid).toBe(false);
    expect(validateAliquotaIss(-2.0).valid).toBe(false);
  });

  it("should calculate simple ISS without retention correctly", () => {
    const res = calculateNfseTaxes({
      valorServicos: 1000.0,
      aliquotaIss: 2.5,
      issRetido: false,
    });

    expect(res.valorServicos).toBe(1000.0);
    expect(res.aliquotaIss).toBe(2.5);
    expect(res.valorIss).toBe(25.0);
    expect(res.issRetido).toBe(false);
    expect(res.valorIssRetido).toBe(0);
    expect(res.valorLiquido).toBe(1000.0);
  });

  it("should calculate ISS with retention reducing the net value", () => {
    const res = calculateNfseTaxes({
      valorServicos: 5000.0,
      aliquotaIss: 5.0,
      issRetido: true,
    });

    expect(res.valorServicos).toBe(5000.0);
    expect(res.valorIss).toBe(250.0);
    expect(res.issRetido).toBe(true);
    expect(res.valorIssRetido).toBe(250.0);
    expect(res.valorLiquido).toBe(4750.0);
  });

  it("should calculate federal withholdings when requested", () => {
    const res = calculateNfseTaxes({
      valorServicos: 10000.0,
      aliquotaIss: 2.0,
      issRetido: false,
      calcularRetencoesFederais: true,
      aliquotaPis: 0.65,
      aliquotaCofins: 3.0,
      aliquotaCsll: 1.0,
      aliquotaIr: 1.5,
    });

    expect(res.valorServicos).toBe(10000.0);
    expect(res.valorIss).toBe(200.0);
    expect(res.valorPis).toBe(65.0);
    expect(res.valorCofins).toBe(300.0);
    expect(res.valorCsll).toBe(100.0);
    expect(res.valorIr).toBe(150.0);
    // Net: 10000 - (65 + 300 + 100 + 150) = 9385.0
    expect(res.valorLiquido).toBe(9385.0);
  });

  it("should correctly handle deductions and unconditional discounts", () => {
    const res = calculateNfseTaxes({
      valorServicos: 2000.0,
      valorDeducoes: 200.0,
      descontoIncondicionado: 100.0,
      aliquotaIss: 3.0,
      issRetido: true,
    });

    // Base: 2000 - 200 - 100 = 1700
    // ISS: 1700 * 0.03 = 51.0
    expect(res.valorIss).toBe(51.0);
    expect(res.valorIssRetido).toBe(51.0);
    // Net: 2000 - 100 (desconto) - 51 (iss retido) = 1849.0
    expect(res.valorLiquido).toBe(1849.0);
  });

  it("should throw an error for invalid aliquot", () => {
    expect(() => {
      calculateNfseTaxes({
        valorServicos: 1000,
        aliquotaIss: 8.0,
      });
    }).toThrow(/inválida/);
  });

  it("should return LC 116 item details", () => {
    const item = getLc116Item("01.07");
    expect(item.code).toBe("01.07");
    expect(item.description).toContain("Suporte técnico");
    expect(item.defaultCnae).toBe("6202000");

    const fallback = getLc116Item("99.99");
    expect(fallback.code).toBe("99.99");
  });
});
