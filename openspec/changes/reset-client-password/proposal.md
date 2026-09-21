## Why

Em operações cotidianas de suporte técnico da LTI Sistemas, é comum que clientes esqueçam suas senhas, percam o acesso ao e-mail ou precisem de uma redefinição emergencial de credenciais para continuar operando seus sistemas. O perfil SUPORTE precisa ter a capacidade de redefinir diretamente a senha de qualquer cliente cadastrado a partir do painel de Gestão de Usuários, com confirmação visual, geração/inserção de nova senha segura (Argon2id com Salt e Pepper), e feedback imediato.

## What Changes

- **Server Action de Redefinição de Senha (`resetUserPasswordAction`)**:
  - Nova Server Action protegida em `lib/actions/auth-actions.ts`.
  - Validação estrita de permissões: apenas usuários autenticados com perfil `SUPORTE` podem invocar a redefinição.
  - Validação de entrada: senha com no mínimo 6 caracteres, usuário alvo existente e não excluído (soft-delete).
  - Criptografia com Argon2id + HMAC-SHA256 Pepper antes de persistir no banco.
- **Modal de Redefinição de Senha (`ResetPasswordModal`)**:
  - Novo modal interativo no diretório `components/suporte/`.
  - Exibe o nome e e-mail do cliente selecionado.
  - Campo de nova senha com botão de alternância para exibir/ocultar senha (olho/EyeOff).
  - Botão utilitário para gerar automaticamente uma senha forte e copiar para a área de transferência.
  - Indicadores de validação, mensagens de erro e estado de carregamento durante a submissão.
- **Integração na Gestão de Usuários (`UsersClientView`)**:
  - Adicionado botão/ícone de ação de "Redefinir Senha" (ícone de chave / `KeyRound` ou `ShieldAlert`) na coluna de Ações de cada cliente na tabela.
  - Apenas o suporte pode visualizar e acionar esse botão para outros usuários.
- **Suíte de Testes Automatizados**:
  - Testes unitários para `resetUserPasswordAction` (sucesso, rejeição para perfil CLIENTE, usuário inexistente, senha curta, erro de banco).
  - Testes de componente para `ResetPasswordModal` e `UsersClientView` integrando o fluxo de redefinição de senha.
  - Manutenção da meta de cobertura mínima de 85% em Statements, Branches, Functions e Lines.

## Capabilities

### New Capabilities
- `ticket-system`: Capacidade de o perfil de suporte técnico redefinir e atualizar senhas de clientes no painel de administração com criptografia Argon2id.

## Impact

- **Server Actions**: Adição de `resetUserPasswordAction` em `lib/actions/auth-actions.ts`.
- **UI Components**: Novo componente `components/suporte/ResetPasswordModal.tsx` e atualização de `components/suporte/UsersClientView.tsx`.
- **Security & Cryptography**: Utilização do algoritmo padrão Argon2id + Pepper da aplicação para armazenamento seguro.
- **Testes**: Novos testes unitários e de componente cobrindo todos os cenários com cobertura >= 85%.
