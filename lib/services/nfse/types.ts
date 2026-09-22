import {
  NfseEnvironment,
  NfseStatus,
  NfseEventType,
} from "@prisma/client";

export { NfseEnvironment, NfseStatus, NfseEventType };

/**
 * Identificação do Prestador de Serviços
 */
export interface NfsePrestador {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string | null;
  inscricaoMunicipal: string;
  codigoMunicipio: string; // Código IBGE (ex: 2611606)
  optanteSimplesNacional: boolean;
  regimeEspecialTributacao?: string | null; // 1 = Microempresa Municipal, 0 = Nenhum
  aliquotaIss: number; // Ex: 2.0 (porcentagem)
  codigoServicoLc116?: string | null; // Ex: 01.07
  cnae?: string | null; // Ex: 6202000
}

/**
 * Identificação do Tomador do Serviço
 */
export interface NfseTomador {
  cpfCnpj: string;
  razaoSocial: string;
  nomeFantasia?: string | null;
  email?: string | null;
  inscricaoMunicipal?: string | null;
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    codigoMunicipio?: string;
    uf?: string;
    cep?: string;
  } | null;
}

/**
 * Detalhes do Serviço Prestado (conforme LC 116/03)
 */
export interface NfseServico {
  codigoLc116: string; // Ex: "01.07" (Suporte técnico, manutenção etc)
  codigoCnae?: string | null;
  codigoTributacaoMunicipal?: string | null;
  discriminacao: string;
  codigoMunicipioIncidencia?: string; // Se omitido, usa o do prestador
}

/**
 * Detalhamento de Valores e Tributos
 */
export interface NfseValores {
  valorServicos: number; // Valor bruto do serviço
  valorDeducoes?: number; // Deduções legalmente permitidas
  descontoIncondicionado?: number;
  descontoCondicionado?: number;
  aliquotaIss: number; // Alíquota percentual (2.0 a 5.0)
  issRetido: boolean; // Se o ISSQN será retido na fonte pelo tomador
  valorIss?: number; // Calculado: (valorServicos - valorDeducoes) * (aliquota / 100)
  valorIssRetido?: number;
  // Retenções Federais (Opcionais)
  valorPis?: number;
  valorCofins?: number;
  valorInss?: number;
  valorIr?: number;
  valorCsll?: number;
  valorLiquido: number; // valorServicos - deduções - retenções
}

/**
 * Estrutura da Declaração de Prestação de Serviços (DPS)
 */
export interface DpsData {
  idDps: string; // ID único para assinatura (ex: "DPS_2611606_1_105")
  numeroDps: string;
  serieDps: string;
  ambiente: NfseEnvironment; // SIMULADOR, PRODUCAO_RESTRITA, PRODUCAO
  dataEmissao: Date;
  dataCompetencia: Date;
  prestador: NfsePrestador;
  tomador: NfseTomador;
  servico: NfseServico;
  valores: NfseValores;
}

/**
 * Resposta de Emissão da API Nacional NFS-e
 */
export interface NfseEmissionResult {
  success: boolean;
  chaveAcesso?: string;
  numeroNfse?: string;
  codigoVerificacao?: string;
  dataEmissao?: Date;
  status: NfseStatus;
  xmlEnviado?: string;
  xmlRetorno?: string;
  danfseUrl?: string;
  mensagens?: Array<{
    codigo: string;
    descricao: string;
    tipo: "ERRO" | "AVISO" | "INFO";
  }>;
  protocolo?: string;
  error?: string;
}

/**
 * Resposta de Consulta de NFS-e
 */
export interface NfseConsultResult {
  success: boolean;
  chaveAcesso: string;
  numeroNfse?: string;
  status: NfseStatus;
  dataEmissao?: Date;
  valorLiquido?: number;
  tomadorNome?: string;
  motivoCancelamento?: string;
  xml?: string;
  error?: string;
}

/**
 * Parâmetros de Cancelamento
 */
export interface NfseCancelInput {
  invoiceId: string;
  motivo: string;
  codigoCancelamento?: string; // "1" = Erro na emissão, "2" = Serviço não prestado, "3" = Erro de assinatura, etc.
}

/**
 * Parâmetros de Substituição
 */
export interface NfseReplaceInput {
  invoiceId: string;
  motivo: string;
  discriminacaoAtualizada?: string;
  novoValor?: number;
  novaAliquota?: number;
}

/**
 * Resumo Visual de NFS-e para Listagens e Modais
 */
export interface NfseSummaryDTO {
  id: string;
  receivableId: string;
  userId: string;
  clientName: string;
  companyName: string;
  status: NfseStatus;
  environment: NfseEnvironment;
  numeroNfse: string | null;
  chaveAcesso: string | null;
  codigoVerificacao: string | null;
  dataEmissao: Date;
  dataCompetencia: Date;
  valorServicos: number;
  valorIss: number;
  aliquotaIss: number;
  valorLiquido: number;
  discriminacaoServico: string;
  codigoServicoLc116: string;
  tomadorCpfCnpj: string;
  tomadorRazaoSocial: string;
  motivoRejeicao: string | null;
  motivoCancelamento: string | null;
  createdAt: Date;
}
