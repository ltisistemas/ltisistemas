import {
  DpsData,
  NfsePrestador,
  NfseTomador,
  NfseServico,
  NfseValores,
  NfseEnvironment,
} from "./types";
import { calculateNfseTaxes, getLc116Item } from "./tax-calculator";

/**
 * Remove caracteres não numéricos de documentos
 */
export function sanitizeDocument(doc: string): string {
  return (doc || "").replace(/\D/g, "");
}

/**
 * Validação rigorosa de CPF pelo algoritmo de módulo 11
 */
export function validateCpf(cpf: string): boolean {
  const clean = sanitizeDocument(cpf);
  if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i), 10) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i), 10) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(clean.charAt(10), 10);
}

/**
 * Validação rigorosa de CNPJ pelo algoritmo de módulo 11
 */
export function validateCnpj(cnpj: string): boolean {
  const clean = sanitizeDocument(cnpj);
  if (clean.length !== 14 || /^(\d)\1{13}$/.test(clean)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(clean.charAt(i), 10) * weights1[i];
  let rest = sum % 11;
  const dig1 = rest < 2 ? 0 : 11 - rest;
  if (dig1 !== parseInt(clean.charAt(12), 10)) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) sum += parseInt(clean.charAt(i), 10) * weights2[i];
  rest = sum % 11;
  const dig2 = rest < 2 ? 0 : 11 - rest;
  return dig2 === parseInt(clean.charAt(13), 10);
}

/**
 * Valida se um documento é CPF ou CNPJ válido
 */
export function validateCpfCnpj(doc: string): { valid: boolean; type: "CPF" | "CNPJ" | "INVALID"; error?: string } {
  const clean = sanitizeDocument(doc);
  if (clean.length === 11) {
    if (validateCpf(clean)) return { valid: true, type: "CPF" };
    return { valid: false, type: "CPF", error: "CPF informado é inválido." };
  }
  if (clean.length === 14) {
    if (validateCnpj(clean)) return { valid: true, type: "CNPJ" };
    return { valid: false, type: "CNPJ", error: "CNPJ informado é inválido." };
  }
  return { valid: false, type: "INVALID", error: "Documento deve conter 11 dígitos (CPF) ou 14 dígitos (CNPJ)." };
}

export interface BuildDpsParams {
  dpsNumero: string;
  dpsSerie?: string;
  environment?: NfseEnvironment;
  dataEmissao?: Date;
  dataCompetencia?: Date;
  prestador: NfsePrestador;
  tomador: NfseTomador;
  servico: {
    codigoLc116?: string;
    discriminacao: string;
    codigoCnae?: string | null;
    codigoTributacaoMunicipal?: string | null;
  };
  valores: {
    valorServicos: number;
    aliquotaIss?: number;
    issRetido?: boolean;
    valorDeducoes?: number;
    descontoIncondicionado?: number;
    valorPis?: number;
    valorCofins?: number;
    valorInss?: number;
    valorIr?: number;
    valorCsll?: number;
  };
}

export interface ValidationIssue {
  field: string;
  message: string;
}

/**
 * Valida todos os campos obrigatórios da DPS
 */
export function validateDpsParams(params: BuildDpsParams): { valid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  // 1. Prestador
  const prestadorCnpjClean = sanitizeDocument(params.prestador?.cnpj);
  if (!validateCnpj(prestadorCnpjClean)) {
    issues.push({ field: "prestador.cnpj", message: "CNPJ do prestador é inválido ou ausente." });
  }
  if (!params.prestador?.inscricaoMunicipal?.trim()) {
    issues.push({ field: "prestador.inscricaoMunicipal", message: "Inscrição Municipal do prestador é obrigatória." });
  }
  if (!params.prestador?.codigoMunicipio?.trim() || sanitizeDocument(params.prestador.codigoMunicipio).length !== 7) {
    issues.push({ field: "prestador.codigoMunicipio", message: "Código IBGE do município do prestador deve conter 7 dígitos." });
  }

  // 2. Tomador
  const tomadorDocRes = validateCpfCnpj(params.tomador?.cpfCnpj);
  if (!tomadorDocRes.valid) {
    issues.push({ field: "tomador.cpfCnpj", message: tomadorDocRes.error || "Documento do tomador inválido." });
  }
  if (!params.tomador?.razaoSocial?.trim()) {
    issues.push({ field: "tomador.razaoSocial", message: "Razão Social ou Nome do tomador é obrigatório." });
  }

  // 3. Serviço
  if (!params.servico?.discriminacao?.trim() || params.servico.discriminacao.trim().length < 5) {
    issues.push({ field: "servico.discriminacao", message: "Discriminação do serviço deve conter ao menos 5 caracteres." });
  }

  // 4. Valores
  if (!params.valores || params.valores.valorServicos <= 0) {
    issues.push({ field: "valores.valorServicos", message: "Valor bruto do serviço deve ser maior que zero." });
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Constrói e estrutura o objeto completo da DPS
 */
export function buildDpsData(params: BuildDpsParams): DpsData {
  const validation = validateDpsParams(params);
  if (!validation.valid) {
    const errorMsg = validation.issues.map((i) => `${i.field}: ${i.message}`).join("; ");
    throw new Error(`Validação da DPS falhou: ${errorMsg}`);
  }

  const serie = (params.dpsSerie || "1").trim();
  const numero = params.dpsNumero.trim();
  const ambiente = params.environment || "SIMULADOR";
  const dataEmissao = params.dataEmissao || new Date();
  const dataCompetencia = params.dataCompetencia || new Date();

  const lc116Item = getLc116Item(params.servico.codigoLc116 || params.prestador.codigoServicoLc116 || "01.07");

  const calculatedValores = calculateNfseTaxes({
    valorServicos: params.valores.valorServicos,
    aliquotaIss: params.valores.aliquotaIss ?? params.prestador.aliquotaIss ?? 2.0,
    issRetido: params.valores.issRetido,
    valorDeducoes: params.valores.valorDeducoes,
    descontoIncondicionado: params.valores.descontoIncondicionado,
    valorPis: params.valores.valorPis,
    valorCofins: params.valores.valorCofins,
    valorInss: params.valores.valorInss,
    valorIr: params.valores.valorIr,
    valorCsll: params.valores.valorCsll,
  });

  const idDps = `DPS${sanitizeDocument(params.prestador.codigoMunicipio)}${ambiente === "PRODUCAO" ? "1" : "2"}${serie.padStart(2, "0")}${numero.padStart(15, "0")}`;

  return {
    idDps,
    numeroDps: numero,
    serieDps: serie,
    ambiente,
    dataEmissao,
    dataCompetencia,
    prestador: {
      ...params.prestador,
      cnpj: sanitizeDocument(params.prestador.cnpj),
      inscricaoMunicipal: params.prestador.inscricaoMunicipal.trim(),
      codigoMunicipio: sanitizeDocument(params.prestador.codigoMunicipio),
    },
    tomador: {
      ...params.tomador,
      cpfCnpj: sanitizeDocument(params.tomador.cpfCnpj),
      razaoSocial: params.tomador.razaoSocial.trim(),
    },
    servico: {
      codigoLc116: lc116Item.code,
      codigoCnae: params.servico.codigoCnae || lc116Item.defaultCnae,
      codigoTributacaoMunicipal: params.servico.codigoTributacaoMunicipal || null,
      discriminacao: params.servico.discriminacao.trim(),
      codigoMunicipioIncidencia: params.prestador.codigoMunicipio,
    },
    valores: calculatedValores,
  };
}

/**
 * Formata a DPS em XML padrão Padrão Nacional NFS-e / Sped
 */
export function generateDpsXml(dps: DpsData): string {
  const tpAmb = dps.ambiente === "PRODUCAO" ? "1" : "2";
  const dhEmi = dps.dataEmissao.toISOString();
  const dCompet = dps.dataCompetencia.toISOString().split("T")[0];
  const isCnpjTomador = dps.tomador.cpfCnpj.length === 14;

  return `<?xml version="1.0" encoding="UTF-8"?>
<DPS xmlns="http://www.sped.fazenda.gov.br/nfse" versao="1.00">
  <infDPS id="${dps.idDps}">
    <tpAmb>${tpAmb}</tpAmb>
    <dhEmi>${dhEmi}</dhEmi>
    <verAplic>LTI-NFSE-1.0.0</verAplic>
    <dCompet>${dCompet}</dCompet>
    <prest>
      <CNPJ>${dps.prestador.cnpj}</CNPJ>
      <IM>${dps.prestador.inscricaoMunicipal}</IM>
      <cMun>${dps.prestador.codigoMunicipio}</cMun>
      <optSimpNac>${dps.prestador.optanteSimplesNacional ? "1" : "2"}</optSimpNac>
    </prest>
    <toma>
      ${isCnpjTomador ? `<CNPJ>${dps.tomador.cpfCnpj}</CNPJ>` : `<CPF>${dps.tomador.cpfCnpj}</CPF>`}
      <xNome>${escapeXml(dps.tomador.razaoSocial)}</xNome>
      ${dps.tomador.email ? `<email>${escapeXml(dps.tomador.email)}</email>` : ""}
    </toma>
    <serv>
      <cLocIncid>${dps.servico.codigoMunicipioIncidencia || dps.prestador.codigoMunicipio}</cLocIncid>
      <cServ>
        <cTribNac>${dps.servico.codigoLc116}</cTribNac>
        <xTribNac>${escapeXml(getLc116Item(dps.servico.codigoLc116).description)}</xTribNac>
        ${dps.servico.codigoCnae ? `<CNAE>${dps.servico.codigoCnae}</CNAE>` : ""}
      </cServ>
      <xDescServ>${escapeXml(dps.servico.discriminacao)}</xDescServ>
    </serv>
    <valores>
      <vServPrest>
        <vServ>${dps.valores.valorServicos.toFixed(2)}</vServ>
        ${(dps.valores.valorDeducoes || 0) > 0 ? `<vDed>${dps.valores.valorDeducoes?.toFixed(2)}</vDed>` : ""}
        ${(dps.valores.descontoIncondicionado || 0) > 0 ? `<vDescIncond>${dps.valores.descontoIncondicionado?.toFixed(2)}</vDescIncond>` : ""}
      </vServPrest>
      <trib>
        <tribMun>
          <tribISSQN>${dps.valores.issRetido ? "2" : "1"}</tribISSQN>
          <pAliq>${dps.valores.aliquotaIss.toFixed(2)}</pAliq>
          <vISSQN>${(dps.valores.valorIss || 0).toFixed(2)}</vISSQN>
          <tpRetISSQN>${dps.valores.issRetido ? "1" : "2"}</tpRetISSQN>
        </tribMun>
        <totTrib>
          <vTotTrib>
            <vLiq>${dps.valores.valorLiquido.toFixed(2)}</vLiq>
          </vTotTrib>
        </totTrib>
      </trib>
    </valores>
  </infDPS>
</DPS>`.trim();
}

function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
