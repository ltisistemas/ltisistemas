## Purpose

Permite que a equipe de suporte técnico da LTI Sistemas abra chamados em nome de clientes cadastrados, acompanhe confirmações com cópia rápida do número do incidente, filtre chamados por cliente, navegue de forma ergonômica e utilize um tema visual em fundo branco com botões nas cores do Bootstrap.

## ADDED Requirements

### Requirement: Abertura de chamado pelo suporte com seleção de cliente solicitante
O sistema DEVE permitir que um usuário com perfil `SUPORTE` selecione qual cliente é o solicitante do ticket durante a criação do chamado.

#### Scenario: Suporte abre chamado vinculando a cliente específico
- **WHEN** um usuário `SUPORTE` preenche o formulário de abertura de chamado, seleciona um cliente no campo de seleção e submete o formulário
- **THEN** o sistema cria o chamado associando o `userId` ao cliente selecionado, calculando o SLA de 6 horas normalmente

#### Scenario: Cliente abre chamado vinculado a si mesmo
- **WHEN** um usuário com perfil `CLIENTE` abre um chamado
- **THEN** o sistema associa automaticamente o chamado ao próprio usuário autenticado sem exibir o campo de seleção de outro cliente

#### Scenario: Validação de cliente inválido ou excluído pelo suporte
- **WHEN** um usuário `SUPORTE` tenta criar um chamado com um identificador de cliente inexistente ou com soft-delete
- **THEN** o sistema rejeita a operação com mensagem de erro e não cria o ticket

### Requirement: Modal de confirmação de sucesso com cópia do número do incidente
Após a criação bem-sucedida de um chamado, o sistema DEVE exibir uma modal de confirmação contendo o número do chamado e a opção de copiar o código/número para a área de transferência.

#### Scenario: Exibição da modal de sucesso pós-criação de chamado
- **WHEN** o usuário (suporte ou cliente) cria um novo chamado com sucesso
- **THEN** o sistema fecha o formulário de criação e exibe a modal de sucesso com o número do chamado (ex: `#1001` ou identificador do incidente) e botão de copiar

#### Scenario: Cópia do número do chamado para o clipboard
- **WHEN** o usuário clica no botão de copiar na modal de sucesso
- **THEN** o sistema copia o identificador/número do ticket para a área de transferência e apresenta feedback visual de cópia realizada

### Requirement: Filtro de chamados por cliente na listagem
O sistema DEVE disponibilizar para a equipe de suporte um filtro dropdown com os clientes cadastrados para filtrar rapidamente os chamados da lista.

#### Scenario: Filtragem por cliente selecionado
- **WHEN** o suporte seleciona um cliente específico no dropdown de filtro de clientes
- **THEN** a lista de chamados é atualizada exibindo exclusivamente os chamados pertencentes àquele cliente

#### Scenario: Limpeza do filtro de cliente
- **WHEN** o suporte seleciona a opção "Todos os Clientes" ou limpa os filtros ativos
- **THEN** a lista de chamados volta a exibir todos os chamados ativos sem restrição de cliente

### Requirement: Ergonomia de navegação no portal de suporte
O portal de suporte DEVE otimizar a navegação interna, removendo links desnecessários para o site público e fornecendo botão de retorno destacado.

#### Scenario: Remoção do link de retorno ao site institucional
- **WHEN** o usuário visualiza o cabeçalho do portal de suporte (`SupportHeader`)
- **THEN** o link "Voltar para o site" não está visível, mantendo o foco nas operações do sistema de suporte

#### Scenario: Botão de retorno em destaque na tela de detalhes do chamado
- **WHEN** o usuário acessa a página de detalhes de um chamado (`/suporte/chamados/[id]`)
- **THEN** o sistema exibe um botão estilizado e altamente visível para retornar à listagem de chamados

### Requirement: Tema visual em fundo branco e botões no padrão Bootstrap
O sistema de chamados e suporte DEVE adotar um layout de fundo branco e limpo, utilizando as cores clássicas do Bootstrap para botões e sinalizações de estado (danger, success, info, warning e primary), sem alterar o site institucional.

#### Scenario: Renderização com tema visual claro e limpo
- **WHEN** o usuário navega pelas telas do portal de suporte (`/suporte/*`)
- **THEN** o layout apresenta superfícies e planos de fundo brancos/claros com contraste nítido

#### Scenario: Aplicação de cores semânticas padrão Bootstrap
- **WHEN** botões e badges de ação são renderizados na interface
- **THEN** ações de exclusão/erro usam danger (`#dc3545`), ações de sucesso/criação usam success (`#198754`), ações de detalhe/informação usam info (`#0dcaf0`), ações de alerta/pendente/reset usam warning (`#ffc107`/`#d39e00`) e ações primárias usam primary (`#0d6efd`)
