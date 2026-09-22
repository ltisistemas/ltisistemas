import {
  DpsData,
  NfseEmissionResult,
  NfseConsultResult,
  NfseEnvironment,
  NfseStatus,
  NfseCancelInput,
  NfseReplaceInput,
} from "./types";
import { signDpsXml } from "./nfse-signer";
import { generateDpsXml } from "./dps-builder";
import crypto from "crypto";

export interface NfseClientConfig {
  environment: NfseEnvironment;
  apiUrl?: string | null;
  certificateBase64?: string | null;
  certificatePassword?: string | null;
  timeoutMs?: number;
  maxRetries?: number;
}

export const NFSE_GOV_URLS = {
  PRODUCAO: "https://api.nfse.gov.br/v1",
  PRODUCAO_RESTRITA: "https://api.producaorestrita.nfse.gov.br/v1",
};

/**
 * Gera a Chave de Acesso padrão da NFS-e Nacional (50 dígitos)
 */
export function generateNfseAccessKey(dps: DpsData, numeroNfse: number | string): string {
  const cMun = dps.prestador.codigoMunicipio.padStart(7, "0");
  const tpAmb = dps.ambiente === "PRODUCAO" ? "1" : "2";
  const mod = "56"; // Modelo 56 = NFS-e Nacional
  const serie = dps.serieDps.padStart(3, "0");
  const numNfse = String(numeroNfse).padStart(9, "0");
  const date = dps.dataEmissao || new Date();
  const aamm = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}`;
  const cnpjPrestador = dps.prestador.cnpj.padStart(14, "0");
  const cNF = crypto.randomInt(100000000, 999999999).toString(); // 9 dígitos aleatórios

  const keyWithoutDv = `${cMun}${tpAmb}${mod}${serie}${numNfse}${aamm}${cnpjPrestador}${cNF}`;
  
  // Cálculo de dígito verificador módulo 11
  let sum = 0;
  let weight = 2;
  for (let i = keyWithoutDv.length - 1; i >= 0; i--) {
    sum += parseInt(keyWithoutDv.charAt(i), 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const mod11 = sum % 11;
  const dv = mod11 < 2 ? 0 : 11 - mod11;

  return `${keyWithoutDv}${dv}`;
}

/**
 * Gera Código de Verificação Alfanumérico (ex: "A9B2-C4D8")
 */
export function generateVerificationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return code;
}

export class NfseApiClient {
  private config: NfseClientConfig;

  constructor(config: NfseClientConfig) {
    this.config = {
      timeoutMs: 15000,
      maxRetries: 3,
      ...config,
    };
  }

  /**
   * Transmite a DPS e emite a NFS-e
   */
  async emitirNfse(dps: DpsData): Promise<NfseEmissionResult> {
    try {
      // 1. Gerar XML da DPS
      const rawXml = generateDpsXml(dps);

      // 2. Assinar Digitalmente
      const signedResult = signDpsXml({
        xml: rawXml,
        certificateBase64: this.config.certificateBase64,
        password: this.config.certificatePassword,
        isSimulator: this.config.environment === "SIMULADOR",
      });

      // 3. Se for modo simulador, processar localmente com alta fidelidade
      if (this.config.environment === "SIMULADOR") {
        return this.processSimulatorEmission(dps, signedResult.signedXml);
      }

      // 4. Envio real para a API Nacional do Gov.br
      const endpoint = `${this.getBaseUrl()}/nfse`;
      const response = await this.sendWithRetry(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          Accept: "application/json, application/xml",
        },
        body: signedResult.signedXml,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          status: "REJEITADA",
          xmlEnviado: signedResult.signedXml,
          error: `Erro na API Nacional (${response.status}): ${errorText}`,
          mensagens: [{ codigo: `HTTP_${response.status}`, descricao: errorText, tipo: "ERRO" }],
        };
      }

      const resData = await response.json();
      return {
        success: true,
        status: "AUTORIZADA",
        chaveAcesso: resData.chaveAcesso,
        numeroNfse: resData.numeroNfse,
        codigoVerificacao: resData.codigoVerificacao,
        protocolo: resData.protocolo,
        dataEmissao: resData.dataEmissao ? new Date(resData.dataEmissao) : new Date(),
        xmlEnviado: signedResult.signedXml,
        xmlRetorno: resData.xmlRetorno || resData.xml,
        danfseUrl: resData.danfseUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        status: "REJEITADA",
        error: error.message || "Erro inesperado ao transmitir NFS-e.",
      };
    }
  }

  /**
   * Consulta o status de uma NFS-e pela chave de acesso
   */
  async consultarNfse(chaveAcesso: string): Promise<NfseConsultResult> {
    if (this.config.environment === "SIMULADOR") {
      return {
        success: true,
        chaveAcesso,
        status: "AUTORIZADA",
        dataEmissao: new Date(),
      };
    }

    try {
      const endpoint = `${this.getBaseUrl()}/nfse/${encodeURIComponent(chaveAcesso)}`;
      const response = await this.sendWithRetry(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        return {
          success: false,
          chaveAcesso,
          status: "REJEITADA",
          error: `Falha ao consultar nota (${response.status})`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        chaveAcesso,
        numeroNfse: data.numeroNfse,
        status: data.status || "AUTORIZADA",
        dataEmissao: data.dataEmissao ? new Date(data.dataEmissao) : new Date(),
        valorLiquido: data.valorLiquido,
        tomadorNome: data.tomador?.razaoSocial,
        xml: data.xml,
      };
    } catch (error: any) {
      return {
        success: false,
        chaveAcesso,
        status: "REJEITADA",
        error: error.message || "Falha na conexão com a API Nacional.",
      };
    }
  }

  /**
   * Cancela uma NFS-e autorizada
   */
  async cancelarNfse(input: NfseCancelInput & { chaveAcesso: string }): Promise<{ success: boolean; protocolo?: string; error?: string }> {
    if (this.config.environment === "SIMULADOR") {
      return {
        success: true,
        protocolo: `SIM_CANC_${Date.now()}`,
      };
    }

    try {
      const endpoint = `${this.getBaseUrl()}/nfse/${encodeURIComponent(input.chaveAcesso)}/eventos`;
      const payload = {
        tipoEvento: "CANCELAMENTO",
        motivo: input.motivo,
        codigoCancelamento: input.codigoCancelamento || "1",
      };

      const response = await this.sendWithRetry(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Falha ao cancelar NFS-e (${response.status}): ${errorText}` };
      }

      const resData = await response.json();
      return { success: true, protocolo: resData.protocolo || resData.numeroProtocolo };
    } catch (error: any) {
      return { success: false, error: error.message || "Erro ao conectar com a API de cancelamento." };
    }
  }

  /**
   * Processador do Simulador Sandbox
   */
  private processSimulatorEmission(dps: DpsData, signedXml: string): NfseEmissionResult {
    const randomNfseNumber = crypto.randomInt(1001, 9999);
    const chaveAcesso = generateNfseAccessKey(dps, randomNfseNumber);
    const codigoVerificacao = generateVerificationCode();
    const protocolo = `PRT${dps.prestador.codigoMunicipio}${Date.now()}`;
    const dataEmissao = new Date();

    const xmlRetorno = `<?xml version="1.0" encoding="UTF-8"?>
<NFSe xmlns="http://www.sped.fazenda.gov.br/nfse" versao="1.00">
  <infNFSe id="NFS${chaveAcesso}">
    <tpAmb>2</tpAmb>
    <verAplic>SIMULADOR-LTI-1.0</verAplic>
    <chNFSe>${chaveAcesso}</chNFSe>
    <nNFSe>${randomNfseNumber}</nNFSe>
    <cVerif>${codigoVerificacao}</cVerif>
    <dhProc>${dataEmissao.toISOString()}</dhProc>
    <nProt>${protocolo}</nProt>
    <vServ>${dps.valores.valorServicos.toFixed(2)}</vServ>
    <vISSQN>${(dps.valores.valorIss || 0).toFixed(2)}</vISSQN>
    <vLiq>${dps.valores.valorLiquido.toFixed(2)}</vLiq>
  </infNFSe>
</NFSe>`.trim();

    return {
      success: true,
      status: "AUTORIZADA",
      chaveAcesso,
      numeroNfse: String(randomNfseNumber),
      codigoVerificacao,
      protocolo,
      dataEmissao,
      xmlEnviado: signedXml,
      xmlRetorno,
      danfseUrl: `/api/nfse/danfse/${chaveAcesso}`,
      mensagens: [
        {
          codigo: "LTI_SIM_001",
          descricao: "NFS-e gerada e autorizada no ambiente de Simulação Nacional.",
          tipo: "INFO",
        },
      ],
    };
  }

  private getBaseUrl(): string {
    if (this.config.apiUrl) return this.config.apiUrl;
    if (this.config.environment === "PRODUCAO") return NFSE_GOV_URLS.PRODUCAO;
    return NFSE_GOV_URLS.PRODUCAO_RESTRITA;
  }

  private async sendWithRetry(url: string, options: RequestInit, attempt = 1): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs || 15000);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return res;
    } catch (err: any) {
      clearTimeout(timeout);
      const maxRetries = this.config.maxRetries || 3;
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 500;
        await new Promise((r) => setTimeout(r, delay));
        return this.sendWithRetry(url, options, attempt + 1);
      }
      throw err;
    }
  }
}
