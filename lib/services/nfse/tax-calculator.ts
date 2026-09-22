import { NfseValores } from "./types";

export interface Lc116ServiceItem {
  code: string;
  description: string;
  defaultCnae: string;
}

export const LC116_SERVICE_CATALOG: Record<string, Lc116ServiceItem> = {
  "01.01": {
    code: "01.01",
    description: "Análise e desenvolvimento de sistemas",
    defaultCnae: "6201501",
  },
  "01.02": {
    code: "01.02",
    description: "Programação de computadores",
    defaultCnae: "6201501",
  },
  "01.03": {
    code: "01.03",
    description: "Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e aplicações",
    defaultCnae: "6311900",
  },
  "01.04": {
    code: "01.04",
    description: "Elaboração de programas de computadores, inclusive jogos eletrônicos",
    defaultCnae: "6201502",
  },
  "01.05": {
    code: "01.05",
    description: "Licenciamento ou cessão de direito de uso de programas de computação",
    defaultCnae: "5829800",
  },
  "01.06": {
    code: "01.06",
    description: "Assessoria e consultoria em tecnologia da informação",
    defaultCnae: "6204000",
  },
  "01.07": {
    code: "01.07",
    description: "Suporte técnico em informática, instalação, configuração e manutenção de programas e bancos de dados",
    defaultCnae: "6202000",
  },
  "01.08": {
    code: "01.08",
    description: "Planejamento, confecção, manutenção e atualização de páginas eletrônicas e portais",
    defaultCnae: "6201502",
  },
};

export interface TaxCalculationParams {
  valorServicos: number;
  aliquotaIss?: number;
  issRetido?: boolean;
  valorDeducoes?: number;
  descontoIncondicionado?: number;
  descontoCondicionado?: number;
  // Retenções opcionais
  calcularRetencoesFederais?: boolean;
  aliquotaPis?: number;
  aliquotaCofins?: number;
  aliquotaCsll?: number;
  aliquotaIr?: number;
  aliquotaInss?: number;
  valorPis?: number;
  valorCofins?: number;
  valorCsll?: number;
  valorIr?: number;
  valorInss?: number;
}

/**
 * Arredonda valor para 2 casas decimais precisas no padrão fiscal brasileiro
 */
export function roundCurrency(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Valida se a alíquota municipal está dentro dos limites da legislação federal (2.00% a 5.00%)
 */
export function validateAliquotaIss(aliquota: number): { valid: boolean; error?: string } {
  if (aliquota === 0) {
    // Alíquota zero permitida apenas em casos de isenção ou imunidade comprovada
    return { valid: true };
  }
  if (aliquota < 2.0 || aliquota > 5.0) {
    return {
      valid: false,
      error: `Alíquota de ISS (${aliquota}%) inválida. Conforme a LC 116/03, o ISS deve situar-se entre 2.00% e 5.00%.`,
    };
  }
  return { valid: true };
}

/**
 * Realiza o cálculo completo dos tributos da NFS-e
 */
export function calculateNfseTaxes(params: TaxCalculationParams): NfseValores {
  const valorServicos = Math.max(0, roundCurrency(params.valorServicos || 0));
  const valorDeducoes = Math.max(0, roundCurrency(params.valorDeducoes || 0));
  const descontoIncondicionado = Math.max(0, roundCurrency(params.descontoIncondicionado || 0));
  const descontoCondicionado = Math.max(0, roundCurrency(params.descontoCondicionado || 0));

  const baseCalculo = Math.max(0, roundCurrency(valorServicos - valorDeducoes - descontoIncondicionado));

  const aliquotaIss = params.aliquotaIss !== undefined ? roundCurrency(params.aliquotaIss) : 2.0;
  const issValidation = validateAliquotaIss(aliquotaIss);
  if (!issValidation.valid) {
    throw new Error(issValidation.error);
  }

  const valorIss = roundCurrency(baseCalculo * (aliquotaIss / 100));
  const issRetido = Boolean(params.issRetido);
  const valorIssRetido = issRetido ? valorIss : 0;

  let valorPis = 0;
  let valorCofins = 0;
  let valorCsll = 0;
  let valorIr = 0;
  let valorInss = 0;

  if (params.calcularRetencoesFederais) {
    valorPis = params.valorPis ?? roundCurrency(baseCalculo * ((params.aliquotaPis ?? 0.65) / 100));
    valorCofins = params.valorCofins ?? roundCurrency(baseCalculo * ((params.aliquotaCofins ?? 3.0) / 100));
    valorCsll = params.valorCsll ?? roundCurrency(baseCalculo * ((params.aliquotaCsll ?? 1.0) / 100));
    valorIr = params.valorIr ?? roundCurrency(baseCalculo * ((params.aliquotaIr ?? 1.5) / 100));
    valorInss = params.valorInss ?? roundCurrency(baseCalculo * ((params.aliquotaInss ?? 0.0) / 100));
  } else {
    valorPis = roundCurrency(params.valorPis || 0);
    valorCofins = roundCurrency(params.valorCofins || 0);
    valorCsll = roundCurrency(params.valorCsll || 0);
    valorIr = roundCurrency(params.valorIr || 0);
    valorInss = roundCurrency(params.valorInss || 0);
  }

  const totalRetencoes = valorIssRetido + valorPis + valorCofins + valorCsll + valorIr + valorInss;
  const valorLiquido = Math.max(0, roundCurrency(valorServicos - descontoIncondicionado - totalRetencoes));

  return {
    valorServicos,
    valorDeducoes,
    descontoIncondicionado,
    descontoCondicionado,
    aliquotaIss,
    issRetido,
    valorIss,
    valorIssRetido,
    valorPis,
    valorCofins,
    valorCsll,
    valorIr,
    valorInss,
    valorLiquido,
  };
}

/**
 * Retorna os detalhes de um item da LC 116/03
 */
export function getLc116Item(code: string): Lc116ServiceItem {
  const cleanCode = code.trim();
  return (
    LC116_SERVICE_CATALOG[cleanCode] || {
      code: cleanCode,
      description: "Serviço de Tecnologia e Suporte de TI",
      defaultCnae: "6202000",
    }
  );
}
