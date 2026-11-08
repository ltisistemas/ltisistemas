import { TicketType } from "@prisma/client";

export const TICKET_TYPE_OPTIONS: Array<{
  value: TicketType;
  label: string;
  description: string;
}> = [
  {
    value: TicketType.BUG,
    label: "Bug / erro",
    description: "Falha ou comportamento incorreto no sistema.",
  },
  {
    value: TicketType.FEATURE,
    label: "Nova funcionalidade",
    description: "Solicitação de novo recurso ou melhoria do sistema.",
  },
  {
    value: TicketType.EXTERNAL_ISSUE,
    label: "Indisponibilidade externa",
    description: "Impacto causado por hospedagem, domínio, DNS ou outro serviço externo — não é uma falha do sistema.",
  },
  {
    value: TicketType.TECHNICAL_CONSULTATION,
    label: "Consulta técnica",
    description: "Registro de uma orientação técnica sem intervenção no sistema.",
  },
  {
    value: TicketType.COMMERCIAL_PROPOSAL,
    label: "Proposta comercial enviada",
    description: "Registro do envio de uma proposta. Este chamado não envia e-mails pela plataforma.",
  },
];

export function isSlaApplicableTicketType(type?: TicketType | string): boolean {
  return type !== TicketType.TECHNICAL_CONSULTATION
    && type !== TicketType.COMMERCIAL_PROPOSAL;
}
