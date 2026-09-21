## Purpose

Permite o gerenciamento comercial e financeiro completo de clientes da LTI Sistemas, englobando contratos de sustentação, receita recorrente mensal (MRR), controle de recebíveis/faturas e pipeline de propostas comerciais com acesso estritamente restrito ao perfil de suporte.

## ADDED Requirements

### Requirement: Strict Role-Based Access for Commercial and Financial Data
O sistema SHALL restringir todas as operações de visualização, criação, edição e exclusão de contratos, recebíveis, propostas comerciais e métricas de faturamento exclusivamente a usuários autenticados com o papel `SUPORTE`. Qualquer tentativa de acesso ou execução proveniente de usuários com papel `CLIENTE` SHALL ser rejeitada com erro de permissão (`FORBIDDEN`).

#### Scenario: Support user accesses client commercial management
- **WHEN** um usuário autenticado com perfil `SUPORTE` acessa o painel comercial de um cliente
- **THEN** o sistema exibe os dados de contratos, faturamento recorrente (MRR), recebíveis e propostas comerciais

#### Scenario: Client user attempts unauthorized access to commercial actions
- **WHEN** um usuário com perfil `CLIENTE` tenta invocar qualquer ação do módulo comercial
- **THEN** o sistema bloqueia a execução, não retorna dados sensíveis e responde com erro de acesso não autorizado

---

### Requirement: Client Contract and MRR Management
O sistema SHALL permitir o cadastro, atualização e listagem de contratos vinculados a cada cliente, armazenando número do contrato, título/objeto, valor mensal recorrente (`monthlyValue` em Reais), dia do vencimento (`billingDay`), vigência (`startDate`, `endDate`), observações e status (`ATIVO`, `SUSPENSO`, `CANCELADO`, `FINALIZADO`). O sistema SHALL calcular o MRR ativo consolidado do cliente.

#### Scenario: Support registers a new monthly contract
- **WHEN** o agente de suporte cadastra um novo contrato informando valor mensal (ex: R$ 480,00), dia de vencimento e datas válidas
- **THEN** o sistema persiste o contrato com status `ATIVO` e atualiza o indicador de MRR do cliente

#### Scenario: Support updates contract status
- **WHEN** o agente de suporte altera o status de um contrato para `SUSPENSO` ou `CANCELADO`
- **THEN** o sistema atualiza o registro e recalcula o MRR ativo do cliente

---

### Requirement: Receivables and Monthly Billings Tracking
O sistema SHALL permitir a gestão de recebíveis e parcelas mensais vinculadas ao cliente, incluindo descrição, competência (`YYYY-MM`), valor (`amount`), data de vencimento (`dueDate`), data de pagamento (`paidDate`), forma de pagamento (`PIX`, `BOLETO`, `TRANSFERENCIA`, `CARTAO`, `OUTRO`) e status (`PENDENTE`, `PAGO`, `ATRASADO`, `CANCELADO`). O sistema SHALL permitir a baixa/confirmação de pagamento em 1 clique e a geração rápida de cobrança para a competência selecionada.

#### Scenario: Support marks a receivable as paid
- **WHEN** o agente de suporte clica na ação de confirmação de pagamento de uma fatura pendente
- **THEN** o sistema registra o status como `PAGO`, armazena a data do pagamento e atualiza os totais recebidos do cliente

#### Scenario: Support creates a new receivable entry
- **WHEN** o agente de suporte adiciona um recebível com competência, valor e data de vencimento
- **THEN** o sistema registra a cobrança com status inicial `PENDENTE`

---

### Requirement: Commercial Proposal Pipeline Management
O sistema SHALL permitir o cadastro e acompanhamento do ciclo de vida de propostas comerciais elaboradas para o cliente, contendo código/número da proposta, título, detalhamento do escopo/solução, valor de implantação/pontual (`oneOffValue`), valor mensal recorrente proposto (`monthlyValue`), data de envio, prazo de validade, link/anexo de documento e status (`RASCUNHO`, `ENVIADA`, `EM_NEGOCIACAO`, `APROVADA`, `RECUSADA`, `EXPIRADA`).

#### Scenario: Support creates a commercial proposal
- **WHEN** o agente de suporte cadastra uma proposta comercial com escopo técnico e valores
- **THEN** o sistema armazena a proposta no pipeline com status selecionado e disponibiliza para consulta no histórico

#### Scenario: Support changes proposal status to approved
- **WHEN** o cliente aceita uma proposta e o suporte altera o status para `APROVADA`
- **THEN** o sistema atualiza o histórico da proposta e oferece opção de converter os valores em um novo contrato ativo

---

### Requirement: Client 360 Degree Commercial Dashboard Interface
O sistema SHALL disponibilizar na área de usuários (`/suporte/usuarios`) uma visualização 360° em abas (*Contratos & MRR*, *Recebíveis & Faturas*, *Propostas Comerciais* e *Chamados Técnicos*), com cards de resumo financeiro destacados em cores Bootstrap (Total MRR em Azul `#0d6efd`, Total Recebido em Verde `#198754`, Pendências em Amarelo `#ffc107` e Atrasados em Vermelho `#dc3545`), além de modais com máscaras monetárias para inclusão e edição rápida.

#### Scenario: Support opens client 360 financial details
- **WHEN** o agente de suporte clica no botão "Gestão Comercial" na linha de um cliente na listagem de usuários
- **THEN** o sistema abre a visualização comercial completa do cliente com KPIs, abas de dados e ações rápidas
