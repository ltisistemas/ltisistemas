# Roadmap de Implementação NFSe - Micro-SAS

## 📅 Timeline Estimada: 8-12 Semanas

```
Semana 1-2     | Setup & Configuração Inicial
Semana 3-4     | Desenvolvimento Backend
Semana 5-6     | Integração API & Testes
Semana 7-8     | Frontend & UX
Semana 9-10    | Testes Integrados (Produção Restrita)
Semana 11-12   | Deploy & Ativação em Produção
```

---

## 🎯 FASE 1: Setup & Configuração (Semanas 1-2)

### Semana 1

**🏛️ Administrativa**
- [ ] Contactar Prefeitura para aderir ao Sistema Nacional NFSe
  - Verificar se já são conveniados
  - Se não, iniciar processo de adesão
- [ ] Obter dados do município:
  - [ ] CNPJ da Prefeitura
  - [ ] Código IBGE
  - [ ] Responsável municipal (para acessar Painel Admin)
- [ ] Agendar treinamento com gestor municipal

**👨‍💻 Técnico**
- [ ] Criar ambiente de desenvolvimento
  - [ ] Node.js 18+ instalado
  - [ ] PostgreSQL/MySQL rodando
  - [ ] Redis para cache
- [ ] Criar repositório Git
- [ ] Configurar variáveis de ambiente (.env.local)
- [ ] Instalar dependências principais:
  ```bash
  npm install axios prisma pg redis zod pino
  npm install -D @prisma/cli
  ```

### Semana 2

**📋 Documentação & Análise**
- [ ] Ler e resumir Guia do Painel Administrativo Municipal
- [ ] Mapear todos os serviços do município (lista de serviços da LC 116/03)
- [ ] Documentar alíquotas municipais (2-5%)
- [ ] Listar benefícios fiscais específicos do município
- [ ] Documentar regras de retenção de ISS

**🗄️ Banco de Dados**
- [ ] Desenhar schema Prisma (modelo fornecido)
- [ ] Criar migrations iniciais
- [ ] Popular dados de teste (alguns serviços, alíquotas)
- [ ] Validar relacionamentos

**🔐 Certificado Digital**
- [ ] Gerar/obter certificado A1 (formato .p12 ou .pfx)
  - Pode ser do município ou do contribuinte (depender da estratégia)
- [ ] Armazenar de forma segura (AWS Secrets Manager recomendado)
- [ ] Testar carregamento do certificado

---

## 🛠️ FASE 2: Desenvolvimento Backend (Semanas 3-4)

### Semana 3

**🔧 Serviços Core**
- [ ] Implementar `DPSBuilder`
  - [ ] Estrutura de Prestador
  - [ ] Estrutura de Tomador
  - [ ] Estrutura de Serviço
  - [ ] Cálculo de valores

- [ ] Implementar `Validador`
  - [ ] Validação de CPF/CNPJ
  - [ ] Validação de alíquotas
  - [ ] Validação de datas
  - [ ] Validação de valores

- [ ] Implementar `Calculadora`
  - [ ] Cálculo de ISS
  - [ ] Cálculo de deduções
  - [ ] Cálculo de retenções

- [ ] Implementar `NFSeAPIClient`
  - [ ] Cliente HTTP com certificado SSL/TLS
  - [ ] Tratamento de erros
  - [ ] Retry logic

### Semana 4

**📡 Integração**
- [ ] Testar conexão com API em Produção Restrita
  - [ ] Validar certificado
  - [ ] Testar endpoint de emissão
  - [ ] Analisar respostas

- [ ] Implementar cache de parametrizações
  - [ ] Cache de alíquotas
  - [ ] Cache de benefícios
  - [ ] Invalidação inteligente

- [ ] Implementar logger estruturado
  - [ ] Logs de emissão
  - [ ] Logs de erro
  - [ ] Logs de auditoria

---

## 💻 FASE 3: API Routes & Testes (Semanas 5-6)

### Semana 5

**📍 Endpoints**
- [ ] POST `/api/nfse/emitir`
  - [ ] Validação de entrada
  - [ ] Chamada ao DPSBuilder
  - [ ] Chamada ao NFSeAPIClient
  - [ ] Salvar no banco de dados
  - [ ] Retornar resposta estruturada

- [ ] GET `/api/nfse/consultar/:chaveNFSe`
  - [ ] Buscar no banco de dados
  - [ ] Se não houver, consultar API

- [ ] POST `/api/nfse/cancelar`
  - [ ] Validar permissões
  - [ ] Chamar API
  - [ ] Registrar evento

- [ ] POST `/api/nfse/substituir`
  - [ ] Validar NFS-e original
  - [ ] Construir nova DPS
  - [ ] Chamar API
  - [ ] Registrar eventos

### Semana 6

**🧪 Testes Automatizados**
- [ ] Testes unitários
  - [ ] Validadores
  - [ ] Calculadora
  - [ ] DPSBuilder

- [ ] Testes de integração
  - [ ] API Client
  - [ ] Endpoints
  - [ ] Banco de dados

- [ ] Testes E2E (Produção Restrita)
  - [ ] Emissão completa
  - [ ] Consulta de NFS-e
  - [ ] Cancelamento
  - [ ] Substituição

```bash
# Executar testes
npm test                    # Testes unitários
npm run test:integration   # Testes de integração
npm run test:e2e          # Testes E2E
```

---

## 🎨 FASE 4: Frontend & UX (Semanas 7-8)

### Semana 7

**📝 Componentes de Emissão**
- [ ] Formulário de Emissão
  - [ ] Validação em tempo real
  - [ ] Auto-cálculo de valores
  - [ ] Busca de serviços
  - [ ] Busca de contribuintes

- [ ] Seletor de Alíquota
  - [ ] Carregar alíquotas permitidas
  - [ ] Mostrar aviso se inválida

- [ ] Calculadora Visual
  - [ ] Mostrar cálculo passo a passo
  - [ ] ISS = Base × Alíquota
  - [ ] Total = Base + Outros valores

### Semana 8

**📊 Visualização & Relatórios**
- [ ] Lista de NFS-e emitidas
  - [ ] Filtro por status
  - [ ] Filtro por data
  - [ ] Busca por chave

- [ ] Detalhes da NFS-e
  - [ ] Mostrar XML
  - [ ] Baixar PDF
  - [ ] Mostrar eventos

- [ ] Dashboard
  - [ ] Total emitido (mês/ano)
  - [ ] Quantidade de NFS-e
  - [ ] Gráfico de alíquotas
  - [ ] Erros e rejeitadas

---

## 🧪 FASE 5: Testes Integrados (Semanas 9-10)

### Semana 9

**🚀 Testes em Produção Restrita**
- [ ] Criar script de testes
- [ ] Teste de emissão simples
- [ ] Teste com tomador identificado
- [ ] Teste sem tomador
- [ ] Teste com benefício fiscal
- [ ] Teste com retenção de ISS
- [ ] Teste com regime especial

**📋 Validação com Município**
- [ ] Compartilhar relatório de testes
- [ ] Confirmar alíquotas
- [ ] Confirmar benefícios
- [ ] Confirmar retenções
- [ ] Obter assinatura de aceite

### Semana 10

**🔄 Testes de Eventos**
- [ ] Cancelamento de NFS-e
  - [ ] Dentro do prazo
  - [ ] Fora do prazo (com análise fiscal)
  - [ ] Com tributos recolhidos

- [ ] Substituição de NFS-e
  - [ ] Com alteração de valores
  - [ ] Com alteração de tomador
  - [ ] Verificar vinculação

- [ ] Análise Fiscal
  - [ ] Submeter para análise
  - [ ] Simular aprovação
  - [ ] Simular rejeição

**📊 Relatórios Finais**
- [ ] Relatório de conformidade
- [ ] Teste de performance
- [ ] Teste de segurança
- [ ] Teste de backup/recuperação

---

## 🚀 FASE 6: Deployment em Produção (Semanas 11-12)

### Semana 11

**🔧 Infraestrutura**
- [ ] Configurar servidor de produção
  - [ ] Instalar dependências
  - [ ] Configurar banco de dados
  - [ ] Configurar Redis
  - [ ] Configurar HTTPS/SSL

- [ ] Variáveis de Ambiente Produção
  - [ ] `NFSE_API_URL` → produção
  - [ ] `DATABASE_URL` → produção
  - [ ] Certificado → AWS Secrets

- [ ] Backup & Recovery
  - [ ] Configurar backup automático do BD
  - [ ] Plano de disaster recovery
  - [ ] Teste de restauração

- [ ] Monitoramento
  - [ ] Sentry para erros
  - [ ] Datadog/CloudWatch para métricas
  - [ ] Alertas configurados

**🔄 Processos**
- [ ] Criar runbook de operações
- [ ] Documentar procedures de emergência
- [ ] Treinar time de suporte

### Semana 12

**✅ Ativação em Produção**
- [ ] Ativar município no Painel Municipal
  - [ ] Clicar em "Ativar Município"
  - [ ] Confirmar parametrizações
  - [ ] Gerar assinatura digital

- [ ] Emissão de testes em produção
  - [ ] Primeira NFS-e
  - [ ] Verificar chegada no ADN
  - [ ] Validar XML

- [ ] Comunicação com clientes
  - [ ] Anunciar disponibilidade
  - [ ] Fornecer documentação
  - [ ] Treinar usuários

- [ ] Monitoramento 24/7 (primeiros dias)
  - [ ] Acompanhar logs
  - [ ] Atender problemas
  - [ ] Coletar feedback

---

## 📊 Detalhamento de Tarefas: Primeira Emissão

### Passos para Emitir Primeira NFS-e

```
1. ANTES DA EMISSÃO
   └─ Validar dados do contribuinte no sistema
   └─ Confirmar alíquota para o serviço
   └─ Confirmar tomador (CPF/CNPJ válido)
   
2. MONTAR DPS
   └─ Bloco 1: Ambiente (1 = Produção Restrita)
   └─ Bloco 2: Prestador (CNPJ, IM, endereço)
   └─ Bloco 3: Tomador (se houver)
   └─ Bloco 4: Serviço (código LC 116/03)
   └─ Bloco 5: Valores (base, alíquota, etc)
   
3. VALIDAR DPS
   └─ CPF/CNPJ válidos?
   └─ Data de execução <= data de emissão?
   └─ Alíquota permitida?
   └─ Valores coerentes?
   
4. ENVIAR À API
   └─ Incluir certificado digital
   └─ POST https://api.producaorestrita.nfse.gov.br/...
   └─ Aguardar resposta (max 30s)
   
5. RECEBER RESPOSTA
   └─ Se autorizada:
      ├─ Salvar chaveNFSe
      ├─ Salvar número da nota
      ├─ Salvar XML
      └─ Retornar para usuário
   
   └─ Se rejeitada:
      ├─ Analisar motivo do erro
      ├─ Corrigir dados
      └─ Reenviar
   
6. PÓS-EMISSÃO
   └─ Disponibilizar download em PDF
   └─ Integrar com ERP (se houver)
   └─ Registrar na auditoria
```

---

## 💰 Estimativa de Custos (Opcional)

| Item | Custo Mensal | Nota |
|------|--------------|------|
| Servidor AWS (t3.large) | R$ 150-200 | Produção |
| RDS PostgreSQL | R$ 100-150 | DB gerenciado |
| ElastiCache Redis | R$ 50-100 | Cache |
| Secrets Manager | R$ 0-30 | Certificado |
| CloudWatch/Logs | R$ 50-100 | Monitoramento |
| **TOTAL** | **R$ 350-580** | Por mês |

---

## ⚠️ Riscos & Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|--------|-----------|
| Certificado expirado | Média | Alto | Renovação 30 dias antes |
| Alíquota incorreta | Média | Alto | Validação com município |
| Falha de conectividade | Baixa | Médio | Retry automático, fila |
| Performance lenta | Baixa | Médio | Cache de parametrizações |
| Rejeição de DPS | Média | Médio | Testes abrangentes |
| Segurança do certificado | Baixa | Crítico | AWS Secrets Manager |

---

## 📋 Checklist Final (Antes de Go Live)

### Funcionalidades
- [ ] Emitir NFS-e (1-5 segundos)
- [ ] Consultar NFS-e (em tempo real)
- [ ] Cancelar NFS-e (com validações)
- [ ] Substituir NFS-e (mantendo vinculação)
- [ ] Gerar PDF (com assinatura)
- [ ] Exportar XML

### Performance
- [ ] Tempo de resposta < 5 segundos
- [ ] Suportar 100+ requisições/minuto
- [ ] 99.9% uptime

### Segurança
- [ ] HTTPS/TLS em todos endpoints
- [ ] Certificado válido
- [ ] Senha segura no banco
- [ ] Logs de auditoria completos
- [ ] Sem dados sensíveis em logs

### Documentação
- [ ] README.md atualizado
- [ ] API documentation (Swagger)
- [ ] Runbook de operações
- [ ] Guia do usuário
- [ ] Troubleshooting guide

### Teste
- [ ] Testes unitários (>80% cobertura)
- [ ] Testes integração (API)
- [ ] Testes E2E (Produção Restrita)
- [ ] Teste de carga (1000 requisições)
- [ ] Teste de segurança (OWASP)

---

## 📞 Contatos Importantes

### Plataforma NFSe
- **Portal**: https://www.nfse.gov.br
- **Painel Testes**: https://www.producaorestrita.nfse.gov.br/PainelMunicipal/
- **Suporte**: suporte@nfse.gov.br
- **Documentação**: https://www.nfse.gov.br/docs

### Seu Município (Recife - Exemplo)
- **Secretaria de Finanças**: (81) XXXX-XXXX
- **Responsável ISSQN**: nome@recife.pe.gov.br
- **CNPJ**: 08.527.847/0001-07

### Seu Time
- **Dev Lead**: você
- **DevOps**: servidor/infraestrutura
- **QA**: testes
- **PM**: planejamento

---

## 🎓 Referências de Aprendizado

```
📚 Documentação
└─ Guia Painel Municipal (172 págs) - FORNECIDO
└─ Lei Complementar 116/03 - Serviços/Alíquotas
└─ Lei Complementar 214/2025 - Obrigatoriedade

🎬 Vídeos
└─ Tutorial NFSe (buscar YouTube: "Tutorial Sistema NFSe")
└─ Webinars CGNFS-e

👨‍💻 Comunidade
└─ Comunidade dev Brasil (Discord/Slack)
└─ Stack Overflow tag: nfse
```

---

## 🚀 Dicas Finais

1. **Comece pelo Essencial**
   - Emitir NFS-e simples
   - Depois adicione complexidades

2. **Teste Muito**
   - Em Produção Restrita é grátis
   - Não há limite de testes

3. **Trabalhe com o Município**
   - Eles entendem as regras deles
   - Coordenação é fundamental

4. **Monitore Desde o Início**
   - Logs ajudam a debugar
   - Alertas previnem problemas

5. **Comunique com Clientes**
   - Explique o processo
   - Defina expectativas

---

**Você consegue! 💪 Qualquer dúvida, revise os guias 1 e 2 fornecidos.**