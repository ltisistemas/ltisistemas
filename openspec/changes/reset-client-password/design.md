## Context

A aplicação utiliza Next.js App Router com Server Actions, Prisma ORM e PostgreSQL (Neon). A autenticação é baseada em cookies JWT com sessões assinadas (`jose`) e senhas armazenadas com hash Argon2id e segredo HMAC-SHA256 Pepper (`lib/auth/password.ts`).

No painel de Gestão de Usuários (`components/suporte/UsersClientView.tsx`), os administradores do suporte podem cadastrar novos usuários, alternar status (ATIVO/INATIVO) e aplicar soft-delete. É necessário adicionar uma ação para redefinir a senha de usuários clientes sem expor senhas anteriores e com validação rígida de permissões.

## Goals / Non-Goals

**Goals:**
- Implementar `resetUserPasswordAction(userId: string, newPassword: string)` protegida exclusivamente para o perfil `SUPORTE`.
- Criar o componente `ResetPasswordModal.tsx` com interface estilizada em harmonia com o design system escuro do portal de suporte.
- Oferecer recurso de visualização/ocultação de senha digitada e gerador automático de senhas aleatórias seguras com botão de cópia.
- Integrar a ação ao botão de redefinição na tabela de usuários em `UsersClientView.tsx`.
- Garantir testes unitários e de componente mantendo cobertura >= 85%.

**Non-Goals:**
- Envio automático de e-mail com a nova senha (o suporte comunicará diretamente o cliente pelo canal habitual de atendimento).
- Redefinição de senha iniciada pelo próprio cliente via link de e-mail (fluxo "esqueci minha senha" público é escopo futuro).
- Redefinição de senha de outros usuários com perfil `SUPORTE` por clientes (proibido por autorização).

## Decisions

### 1. Server Action Dedicada `resetUserPasswordAction`
- **Decisão**: Criar uma função específica `resetUserPasswordAction(targetUserId: string, newPassword: string)` em `lib/actions/auth-actions.ts` em vez de reutilizar ou sobrecarregar `updateUser`.
- **Justificativa**: Garante separação clara de responsabilidades, validação específica de tamanho de senha ($\ge 6$ caracteres) e checagem de autorização do perfil `SUPORTE`.
- **Alternativas consideradas**: Ação genérica de edição de usuário. Rejeitada por misturar atualização de metadados com alteração crítica de credenciais de acesso.

### 2. Criptografia Padrão Argon2id + Pepper
- **Decisão**: Utilizar `hashPassword` de `lib/auth/password.ts` (Argon2id com 64MB de memória, 3 iterações, salt aleatório e pepper secreto no servidor).
- **Justificativa**: Mantém uniformidade e a mais alta segurança criptográfica contra ataques de força bruta e dicionário.

### 3. Modal Dedicado com Utilitário de Geração de Senha
- **Decisão**: Criar `ResetPasswordModal.tsx` com gerador de senha segura embutido (10+ caracteres alfanuméricos com símbolos) e botão de copiar para clipboard.
- **Justificativa**: Proporciona agilidade ao atendente de suporte, que pode gerar uma senha forte instantaneamente e passá-la ao cliente com 1 clique.

## Risks / Trade-offs

- **[Risco: Alteração acidental de senha]** → Confirmação explícita no modal, exibição clara do nome e e-mail do usuário alvo antes do envio.
- **[Risco: Tentativa de redefinição por usuário não autorizado]** → Validação no servidor via `getSession()` confirmando `role === 'SUPORTE'`.
- **[Risco: Usuário soft-deleted ou inexistente]** → Validação no Prisma filtrando `deletedAt: null` antes de realizar o update.
