## Purpose

Permite que a equipe de suporte técnico redefina a senha de acesso de qualquer cliente no portal administrativo da LTI Sistemas com validação e segurança criptográfica.

## ADDED Requirements

### Requirement: Redefinição de senha de cliente por usuário SUPORTE
O sistema DEVE permitir que um usuário autenticado com perfil SUPORTE altere a senha de qualquer usuário cliente cadastrado e ativo.

#### Scenario: Suporte redefine senha com sucesso
- **WHEN** o usuário SUPORTE informa uma nova senha com pelo menos 6 caracteres para um cliente existente e confirma a operação
- **THEN** o sistema atualiza o hash da senha no banco de dados com Argon2id e pepper, exibindo mensagem de sucesso

#### Scenario: Rejeição de redefinição por usuário não autorizado
- **WHEN** uma requisição de redefinição de senha é disparada por um usuário com perfil CLIENTE ou sem sessão autenticada
- **THEN** o sistema rejeita a operação com erro de autorização e não modifica a senha do usuário alvo

#### Scenario: Validação de tamanho mínimo da nova senha
- **WHEN** o usuário SUPORTE tenta redefinir a senha com menos de 6 caracteres
- **THEN** o sistema bloqueia a submissão e exibe mensagem de erro informando a exigência de tamanho mínimo

#### Scenario: Tentativa de redefinição para usuário excluído ou inexistente
- **WHEN** o suporte tenta redefinir a senha de um identificador de usuário inexistente ou com soft-delete
- **THEN** o sistema retorna erro informando que o usuário não foi localizado

### Requirement: Modal de redefinição de senha na interface de gestão
A tela de gestão de usuários DEVE disponibilizar um modal dedicado para o suporte redefinir a senha de um cliente selecionado com recursos de visualização e geração de senha.

#### Scenario: Abertura do modal de redefinição de senha
- **WHEN** o usuário SUPORTE clica no botão "Redefinir Senha" na linha de um cliente
- **THEN** o sistema exibe o modal contendo o nome, e-mail do cliente e campo para digitar ou gerar nova senha

#### Scenario: Geração automática de senha segura
- **WHEN** o usuário clica no botão de gerar senha dentro do modal
- **THEN** o sistema preenche o campo com uma senha aleatória segura e permite copiar o valor diretamente para a área de transferência
