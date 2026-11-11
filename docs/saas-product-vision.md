# Visão de Produto: SaaS de suporte para profissionais de TI independentes

## 1. Resumo executivo

Transformar o portal de suporte da LTI Sistemas em um SaaS simples para desenvolvedores freelancers, MEIs e pequenas empresas de suporte de TI. O produto deve ajudar cada prestador a organizar o atendimento de vários clientes, receber erros automaticamente dos sistemas que mantém e demonstrar o trabalho realizado.

**Proposta de valor:** uma central leve de operação que reúne solicitações de clientes, telemetria de erros, acompanhamento de atendimento e relatórios — sem exigir uma ferramenta corporativa complexa.

A solução atual já oferece elementos que podem servir de base, como chamados, SLA, telemetria com deduplicação, relatórios, cadastro de clientes, contratos e integrações por API. Isso não significa que a arquitetura atual já seja multi-tenant ou esteja pronta para comercialização como SaaS; essa capacidade deverá ser projetada, implementada e validada antes de aceitar múltiplos prestadores independentes.

## 2. Público-alvo e problema

### Público inicial

- Desenvolvedores freelancers que mantêm sistemas de diversos clientes.
- MEIs que prestam suporte técnico ou sustentação de software.
- Pequenas empresas de suporte de TI, com equipes enxutas.

### Problemas a validar com usuários

- Solicitações chegam por canais dispersos e são esquecidas.
- É difícil relacionar erros em produção ao cliente, sistema e projeto corretos.
- O prestador precisa atualizar o cliente sobre o andamento manualmente.
- É trabalhoso demonstrar o volume e o valor do trabalho recorrente.
- Ferramentas de service desk maiores podem ser complexas ou caras para um profissional independente.

## 3. Posicionamento

O produto não deve competir inicialmente como um service desk corporativo completo. O foco é a operação diária de quem atende várias empresas com uma equipe pequena.

**Diferencial a explorar:** conectar chamados originados pelo cliente com incidentes detectados automaticamente nos sistemas que o prestador mantém, e transformar esse histórico em comunicação e relatórios compreensíveis.

## 4. Princípios do produto

1. **Configuração rápida:** o prestador deve conseguir cadastrar um cliente e começar a receber solicitações sem implantação complexa.
2. **Experiência simples para o cliente final:** abrir e acompanhar um chamado deve ser intuitivo, inclusive para quem não é técnico.
3. **Automação útil e controlável:** automatizar tarefas repetitivas sem esconder decisões ou gerar notificações excessivas.
4. **Privacidade por padrão:** dados de clientes e prestadores devem ser isolados e acessados somente por usuários autorizados.
5. **Valor demonstrável:** relatórios devem ajudar o profissional a explicar o atendimento prestado, sem prometer métricas que não sejam medidas corretamente.
6. **Evolução orientada por validação:** construir integrações e funcionalidades após confirmar demanda com o público-alvo.

## 5. Escopo do MVP

### Funcionalidades essenciais

- Cadastro e autenticação do prestador.
- Criação de um espaço de trabalho (workspace) por prestador.
- Cadastro e organização de clientes e projetos/sistemas.
- Chamados com status, prioridade, responsável, histórico e anexos.
- Portal de cliente para abertura e acompanhamento das próprias solicitações.
- Ingestão de incidentes por API, com chave revogável e deduplicação.
- Notificações básicas sobre abertura, resposta e mudança de status.
- Relatório simples por cliente e período, com chamados, tempos de atendimento e incidentes.
- Limites de uso visíveis, mesmo que a cobrança seja inicialmente manual ou em modo de teste.

### Fora do MVP inicial

- Integrações simultâneas com todos os canais (WhatsApp, e-mail, chat e redes sociais).
- Automação avançada com construtor visual de regras.
- Gestão financeira/fiscal completa ou emissão de documentos fiscais para todos os cenários.
- Aplicativo móvel nativo.
- Recursos de ITSM corporativo, como CMDB completa, gestão de mudanças ou catálogo extenso de serviços.

## 6. Roadmap sugerido

### Fase 0 — Descoberta e preparação

- Entrevistar de 5 a 10 profissionais do público-alvo.
- Mapear como recebem chamados hoje e quais ferramentas usam.
- Testar protótipo do fluxo prestador → cliente → chamado → atualização → relatório.
- Definir modelo de dados multi-tenant, papéis, limites e política de retenção.

**Critério de saída:** identificar um problema recorrente e um fluxo pelo qual os entrevistados aceitariam migrar ou pagar.

### Fase 1 — MVP privado

- Implementar workspace e isolamento entre prestadores.
- Organizar clientes, projetos, chamados e telemetria dentro do workspace.
- Entregar portal simples para clientes e notificações essenciais.
- Disponibilizar relatórios básicos.
- Convidar um pequeno grupo de profissionais para piloto assistido.

**Critério de saída:** os pilotos usam o produto em atendimentos reais e conseguem concluir o fluxo principal sem suporte constante da equipe do produto.

### Fase 2 — Lançamento pago simples

- Medir uso por workspace e aplicar limites claros.
- Oferecer plano gratuito ou teste e um plano pago inicial.
- Integrar cobrança recorrente após validar o modelo de preço e os meios de pagamento necessários.
- Melhorar onboarding, documentação da API e recuperação de conta.

### Fase 3 — Crescimento baseado em uso

- Priorizar os canais de entrada mais solicitados pelos usuários.
- Adicionar base de conhecimento, automações e relatórios aprimorados.
- Considerar domínio/branding personalizado e novos níveis de colaboração.
- Expandir SDKs e ferramentas de diagnóstico conforme a demanda.

## 7. Arquitetura e segurança multi-tenant

A hierarquia conceitual recomendada é:

```text
Workspace (prestador)
├── Membros e papéis
├── Clientes
│   └── Projetos/sistemas
│       ├── Chamados
│       ├── Incidentes/telemetria
│       └── Chaves de integração
├── Configurações e marca
└── Plano, limites e uso
```

### Requisitos obrigatórios antes do SaaS público

- Todo dado pertencente a um prestador deve estar associado a um `workspaceId` (ou mecanismo equivalente).
- Toda leitura e escrita no servidor deve verificar que o usuário autenticado pertence ao workspace e tem permissão para a operação.
- Não confiar em `workspaceId`, `clientId` ou papel enviados pelo navegador sem validação do lado do servidor.
- Definir índices e restrições que reduzam o risco de associações entre workspaces.
- Separar a identidade do usuário de seu vínculo e papel em cada workspace; evitar depender apenas dos papéis atuais `SUPORTE` e `CLIENTE`.
- As chaves de API devem ser armazenadas de forma segura, exibidas integralmente apenas na criação, revogáveis e limitadas ao workspace/projeto apropriado.
- Aplicar limites de requisição, validação de payload e proteção contra abuso na API de ingestão.
- Mascarar ou remover segredos e dados pessoais de payloads e stack traces, e permitir configurar retenção e exclusão.
- Registrar eventos relevantes de auditoria, sem gravar credenciais ou segredos nos logs.
- Testar explicitamente que usuários de um workspace não conseguem acessar recursos de outro, inclusive por IDs conhecidos.
- Planejar exportação e exclusão de dados por workspace e backups com controle de acesso.

A segurança multi-tenant deve ser tratada como requisito arquitetural e testada desde a primeira fase, não como uma melhoria posterior.

## 8. Modelo de planos a validar

Evitar fixar preços antes de conversar com usuários. Testar inicialmente limites fáceis de compreender, por exemplo:

- quantidade de clientes ativos;
- quantidade de projetos/sistemas;
- volume mensal de eventos de telemetria;
- quantidade de membros no workspace;
- retenção de histórico e recursos de relatório.

Os limites devem ser transparentes, com indicação de uso e comportamento definido ao atingi-los. Não descartar incidentes silenciosamente: informar o prestador e oferecer uma forma clara de aumentar o limite ou reduzir o consumo.

## 9. Métricas de validação

### Ativação

- Percentual de prestadores que cadastram o primeiro cliente e projeto.
- Percentual que recebe ou cria o primeiro chamado.
- Tempo até o primeiro valor percebido (por exemplo, primeiro chamado acompanhado ou incidente agrupado).

### Uso e retenção

- Workspaces ativos semanal e mensalmente.
- Clientes e projetos ativos por workspace.
- Chamados criados, respondidos e resolvidos.
- Workspaces que permanecem ativos após 4 e 8 semanas.

### Qualidade do atendimento

- Tempo até primeira resposta.
- Tempo até resolução, segmentado por tipo e prioridade.
- Percentual de chamados reabertos.
- Cumprimento de SLA, quando o plano/contrato definir um SLA aplicável.

### Viabilidade comercial

- Conversão de piloto/teste para plano pago.
- Cancelamentos e motivos.
- Receita recorrente por workspace e custo de servir cada plano.

## 10. Riscos e mitigação

| Risco | Mitigação sugerida |
| --- | --- |
| Construir muitos canais antes de saber qual é usado | Validar o canal prioritário em entrevistas e pilotos. |
| Vazamento de dados entre prestadores | Isolamento multi-tenant no servidor, testes de autorização e revisão de segurança. |
| Excesso de alertas de telemetria | Deduplicação, limites, configuração por projeto e controles de ruído. |
| Produto ficar amplo demais para o público inicial | Manter o MVP focado em atendimento, telemetria e prestação de contas. |
| Métricas de SLA pouco confiáveis | Definir calendário, pausas, prioridade e regras de cálculo antes de exibir indicadores. |
| Custo imprevisível de eventos e armazenamento | Medir consumo por workspace e estabelecer limites, retenção e alertas. |
| Complexidade de cobrança e fiscal precoce | Validar disposição a pagar antes de ampliar integrações comerciais. |

## 11. Plano de descoberta com usuários

Perguntas sugeridas para entrevistas:

1. Como chegam hoje os pedidos de suporte dos seus clientes?
2. Conte sobre a última solicitação que quase foi esquecida ou perdeu contexto.
3. Como você descobre que um sistema mantido por você apresentou erro?
4. Como associa um erro a um cliente, projeto e ambiente?
5. Como informa o andamento e demonstra o trabalho feito no mês?
6. Quais ferramentas já tentou usar e por que continuou ou deixou de usá-las?
7. Qual parte do fluxo atual tomaria mais valor se fosse automatizada?
8. O que precisaria estar resolvido para você migrar um cliente para uma ferramenta nova?
9. Qual modelo de cobrança seria previsível para seu negócio?
10. Que dados você não enviaria para uma plataforma de suporte e telemetria?

Registrar exemplos concretos e frequência dos problemas; não tratar uma preferência hipotética por funcionalidades como evidência suficiente de demanda.

## 12. Próximas decisões

- Escolher o segmento inicial mais específico: freelancer individual, MEI de suporte ou pequena empresa de TI.
- Decidir se o primeiro cliente final acessa o portal por convite, link seguro ou conta própria.
- Escolher o primeiro canal de notificação e o canal de entrada adicional a validar.
- Definir o modelo de isolamento e migração de dados antes de habilitar múltiplos workspaces.
- Conduzir entrevistas e protótipo antes de comprometer o roadmap completo.

## 13. Relação com a implementação atual

Esta documentação descreve uma direção de produto e um plano recomendado, não uma declaração de funcionalidades já implementadas. Os recursos existentes devem ser auditados no código antes de serem reutilizados no SaaS. Em especial, chamados, integrações, contratos, relatórios e papéis de usuário precisam ser revisados para garantir escopo por workspace, autorização consistente e adequação ao novo público.
