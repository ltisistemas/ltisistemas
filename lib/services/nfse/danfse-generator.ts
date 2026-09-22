import { NfseSummaryDTO } from "./types";
import { getLc116Item } from "./tax-calculator";

export interface DanfseRenderData {
  numeroNfse: string;
  chaveAcesso: string;
  codigoVerificacao: string;
  dataEmissao: Date | string;
  dataCompetencia: Date | string;
  status: string;
  // Prestador
  prestador: {
    razaoSocial: string;
    nomeFantasia?: string | null;
    cnpj: string;
    inscricaoMunicipal: string;
    codigoMunicipio: string;
    municipioNome?: string;
    uf?: string;
    optanteSimples?: boolean;
  };
  // Tomador
  tomador: {
    razaoSocial: string;
    cpfCnpj: string;
    inscricaoMunicipal?: string | null;
    email?: string | null;
    endereco?: string | null;
  };
  // Serviço e Valores
  servico: {
    codigoLc116: string;
    codigoCnae?: string | null;
    discriminacao: string;
  };
  valores: {
    valorServicos: number;
    valorDeducoes?: number;
    baseCalculo?: number;
    aliquotaIss: number;
    valorIss: number;
    issRetido: boolean;
    valorIssRetido?: number;
    valorPis?: number;
    valorCofins?: number;
    valorInss?: number;
    valorIr?: number;
    valorCsll?: number;
    valorLiquido: number;
  };
}

/**
 * Formata CPF ou CNPJ com máscara padrão
 */
export function formatDocument(doc: string): string {
  const clean = (doc || "").replace(/\D/g, "");
  if (clean.length === 11) {
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (clean.length === 14) {
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return doc;
}

/**
 * Formata moeda BRL
 */
export function formatCurrencyBRL(val: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val || 0);
}

/**
 * Formata data e hora no fuso horário brasileiro
 */
export function formatDateTimeBR(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(d);
}

/**
 * Gera o HTML completo e estilizável do DANFSE (Padrão Nacional NFS-e)
 */
export function renderDanfseHtml(data: DanfseRenderData): string {
  const lc116 = getLc116Item(data.servico.codigoLc116);
  const qrValidationUrl = `https://www.nfse.gov.br/consultapublica?chave=${data.chaveAcesso}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>DANFSE - Nota Fiscal de Serviços Eletrônica Nº ${data.numeroNfse}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; }
    body { background: #f3f4f6; color: #111827; padding: 20px; font-size: 12px; }
    .danfse-container { max-width: 850px; margin: 0 auto; background: #ffffff; border: 1px solid #d1d5db; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header-box { display: flex; justify-content: space-between; border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px; }
    .header-title { font-size: 16px; font-weight: bold; text-transform: uppercase; color: #0f172a; }
    .header-subtitle { font-size: 11px; color: #475569; margin-top: 2px; }
    .header-badge { text-align: right; }
    .badge-number { font-size: 18px; font-weight: bold; color: #2563eb; }
    .section-box { border: 1px solid #cbd5e1; border-radius: 4px; margin-bottom: 12px; overflow: hidden; }
    .section-header { background: #f8fafc; border-bottom: 1px solid #cbd5e1; padding: 6px 12px; font-weight: bold; font-size: 11px; text-transform: uppercase; color: #334155; }
    .section-body { padding: 10px 12px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .field-label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .field-value { font-size: 12px; font-weight: 500; color: #0f172a; margin-top: 2px; }
    .disc-text { white-space: pre-wrap; font-size: 12px; line-height: 1.5; color: #1e293b; }
    .table-values { width: 100%; border-collapse: collapse; margin-top: 6px; }
    .table-values th, .table-values td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: right; }
    .table-values th { background: #f1f5f9; font-size: 10px; color: #475569; font-weight: 600; text-transform: uppercase; }
    .table-values td { font-size: 12px; font-weight: 600; }
    .total-row { background: #eff6ff; font-size: 13px; font-weight: bold; color: #1e40af; }
    .footer-info { margin-top: 16px; padding-top: 12px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b; }
    .key-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 10px; font-family: monospace; font-size: 11px; letter-spacing: 0.5px; border-radius: 4px; word-break: break-all; margin-top: 4px; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .danfse-container { border: none; box-shadow: none; padding: 0; width: 100%; max-width: 100%; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="danfse-container">
    <div class="header-box">
      <div>
        <div class="header-title">DANFSE — Documento Auxiliar da NFS-e</div>
        <div class="header-subtitle">Sistema Nacional da Nota Fiscal de Serviços Eletrônica (Padrão Nacional / Gov.br)</div>
      </div>
      <div class="header-badge">
        <div class="field-label">NÚMERO DA NFS-e</div>
        <div class="badge-number">${data.numeroNfse}</div>
      </div>
    </div>

    <!-- Dados da Chave de Acesso -->
    <div class="section-box">
      <div class="section-header">Identificação e Validação do Documento</div>
      <div class="section-body">
        <div class="grid-3">
          <div>
            <div class="field-label">Código de Verificação</div>
            <div class="field-value" style="font-family: monospace; font-weight: bold; color: #2563eb;">${data.codigoVerificacao}</div>
          </div>
          <div>
            <div class="field-label">Data e Hora de Emissão</div>
            <div class="field-value">${formatDateTimeBR(data.dataEmissao)}</div>
          </div>
          <div>
            <div class="field-label">Competência</div>
            <div class="field-value">${typeof data.dataCompetencia === "string" ? data.dataCompetencia : data.dataCompetencia.toISOString().split("T")[0]}</div>
          </div>
        </div>
        <div style="margin-top: 8px;">
          <div class="field-label">Chave de Acesso Nacional da NFS-e (50 dígitos)</div>
          <div class="key-box">${data.chaveAcesso}</div>
        </div>
      </div>
    </div>

    <!-- Prestador -->
    <div class="section-box">
      <div class="section-header">Prestador de Serviços</div>
      <div class="section-body">
        <div class="grid-2">
          <div>
            <div class="field-label">Razão Social / Nome</div>
            <div class="field-value">${data.prestador.razaoSocial}</div>
          </div>
          <div>
            <div class="field-label">CNPJ</div>
            <div class="field-value">${formatDocument(data.prestador.cnpj)}</div>
          </div>
        </div>
        <div class="grid-3" style="margin-top: 8px;">
          <div>
            <div class="field-label">Inscrição Municipal</div>
            <div class="field-value">${data.prestador.inscricaoMunicipal}</div>
          </div>
          <div>
            <div class="field-label">Município / UF</div>
            <div class="field-value">${data.prestador.municipioNome || "Recife"} / ${data.prestador.uf || "PE"} (IBGE: ${data.prestador.codigoMunicipio})</div>
          </div>
          <div>
            <div class="field-label">Regime Tributário</div>
            <div class="field-value">${data.prestador.optanteSimples ? "Optante pelo Simples Nacional" : "Regime Normal"}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tomador -->
    <div class="section-box">
      <div class="section-header">Tomador de Serviços (Cliente)</div>
      <div class="section-body">
        <div class="grid-2">
          <div>
            <div class="field-label">Nome / Razão Social</div>
            <div class="field-value">${data.tomador.razaoSocial}</div>
          </div>
          <div>
            <div class="field-label">CPF / CNPJ</div>
            <div class="field-value">${formatDocument(data.tomador.cpfCnpj)}</div>
          </div>
        </div>
        <div class="grid-2" style="margin-top: 8px;">
          <div>
            <div class="field-label">E-mail</div>
            <div class="field-value">${data.tomador.email || "Não informado"}</div>
          </div>
          <div>
            <div class="field-label">Inscrição Municipal</div>
            <div class="field-value">${data.tomador.inscricaoMunicipal || "Não informada"}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Serviço -->
    <div class="section-box">
      <div class="section-header">Discriminação dos Serviços Prestados</div>
      <div class="section-body">
        <div style="margin-bottom: 8px;">
          <div class="field-label">Item da LC 116/03</div>
          <div class="field-value" style="color: #1d4ed8;">${lc116.code} — ${lc116.description}</div>
        </div>
        <div class="field-label">Descrição do Serviço</div>
        <div class="disc-text" style="margin-top: 4px; padding: 8px; background: #fafafa; border: 1px solid #f1f5f9; border-radius: 4px;">
${data.servico.discriminacao}
        </div>
      </div>
    </div>

    <!-- Valores -->
    <div class="section-box">
      <div class="section-header">Detalhamento dos Valores e Tributação</div>
      <div class="section-body" style="padding: 0;">
        <table class="table-values">
          <thead>
            <tr>
              <th>Valor do Serviço</th>
              <th>Deduções</th>
              <th>Base de Cálculo</th>
              <th>Alíquota ISS</th>
              <th>Valor ISS</th>
              <th>ISS Retido</th>
              <th class="total-row">Valor Líquido</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${formatCurrencyBRL(data.valores.valorServicos)}</td>
              <td>${formatCurrencyBRL(data.valores.valorDeducoes || 0)}</td>
              <td>${formatCurrencyBRL((data.valores.valorServicos || 0) - (data.valores.valorDeducoes || 0))}</td>
              <td>${(data.valores.aliquotaIss || 0).toFixed(2)}%</td>
              <td>${formatCurrencyBRL(data.valores.valorIss || 0)}</td>
              <td>${data.valores.issRetido ? "SIM" : "NÃO"}</td>
              <td class="total-row">${formatCurrencyBRL(data.valores.valorLiquido)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="footer-info">
      <div>
        <div>Documento gerado em conformidade com as Leis Complementares 116/2003 e 214/2025.</div>
        <div>Verifique a autenticidade deste documento em: <strong>${qrValidationUrl}</strong></div>
      </div>
      <div style="text-align: right;">
        <div>LTI Sistemas — Central de Faturamento</div>
        <div style="font-weight: bold; color: #16a34a;">STATUS: ${data.status}</div>
      </div>
    </div>
  </div>
</body>
</html>`.trim();
}
