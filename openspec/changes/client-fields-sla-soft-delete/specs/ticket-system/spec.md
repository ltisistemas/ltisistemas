## Purpose

Permite gerenciar clientes com informações do site ou sistema e status de atividade, registrar chamados com especificação do nome da tela, monitorar o cumprimento do SLA de 6 horas para análise inicial, e assegurar a preservação de dados e conformidade com exclusão lógica (soft-delete) em todas as entidades.

## ADDED Requirements

### Requirement: Client system address and status lifecycle
O sistema SHALL registrar o endereço/URL do site ou sistema do cliente (`systemUrl`) e seu status operacional (`ATIVO` ou `INATIVO`, com padrão `ATIVO`). O sistema SHALL impedir que usuários com status `INATIVO` ou marcados com exclusão lógica realizem login na plataforma.

#### Scenario: Cadastro de cliente com sistema e status ativo
- **WHEN** o administrador de suporte cadastra um novo cliente informando nome, email, empresa, senha, endereço do site/sistema e status `ATIVO`
- **THEN** o cliente é criado com os dados persistidos e status `ATIVO`, ficando apto a efetuar login e abrir chamados

#### Scenario: Tentativa de login de cliente inativo
- **WHEN** um usuário com status `INATIVO` tenta realizar login com credenciais válidas
- **THEN** o sistema recusa a autenticação com a mensagem informando que a conta está inativa e orienta contato com o suporte

### Requirement: Ticket screen identification and 6-hour SLA
O sistema SHALL exigir o preenchimento do campo Nome da tela (`screenName`) na abertura do chamado e SHALL calcular automaticamente o prazo de SLA para análise inicial em 6 horas a partir do momento da abertura (`slaDueAt = createdAt + 6 horas`). O sistema SHALL exibir o nome da tela e um indicador visual do status do SLA de 6 horas (dentro do prazo, em alerta ou estourado).

#### Scenario: Abertura de chamado com nome da tela e SLA calculado
- **WHEN** o cliente submete a abertura de um chamado informando título, nome da tela (ex: "Cadastro de Clientes"), descrição e anexos opcionais
- **THEN** o chamado é registrado com o `screenName` fornecido e com `slaDueAt` exatamente 6 horas à frente do horário de criação

#### Scenario: Exibição visual do SLA e tela na listagem e detalhes
- **WHEN** o cliente ou equipe de suporte visualiza a lista ou a página de detalhes de um chamado
- **THEN** o sistema exibe o nome da tela afetada, o link do sistema do cliente e o status/tempo restante do SLA de 6h para análise

### Requirement: Global soft delete for entities
O sistema SHALL implementar exclusão lógica (`soft-delete`) em todas as entidades principais (`User` e `Ticket`), marcando o campo `deletedAt` com o timestamp da exclusão em vez de remover o registro físico do banco de dados. Todas as consultas e listagens padrão SHALL filtrar automaticamente registros com `deletedAt != null`.

#### Scenario: Exclusão lógica de chamado
- **WHEN** o suporte ou cliente solicita a exclusão de um chamado
- **THEN** o sistema preenche o campo `deletedAt` do chamado com a data/hora atual e o chamado deixa de aparecer nas listagens regulares, permanecendo no banco para histórico

#### Scenario: Exclusão lógica de usuário
- **WHEN** o suporte executa a exclusão de um usuário cliente
- **THEN** o sistema marca `deletedAt` e define o status como `INATIVO`, impedindo novos logins enquanto mantém íntegros todos os chamados previamente abertos por aquele cliente
