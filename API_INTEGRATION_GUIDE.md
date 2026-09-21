# Guia de Integração — API de Ingestão de Incidentes & Telemetria
**LTI Sistemas — Central de Suporte & Telemetria Automatizada**

Este documento contém a documentação completa dos endpoints e exemplos de código prontos para copiar e colar em **cURL, PHP Puro, Laravel, Python e Next.js/TypeScript**, permitindo que seus sistemas reportem erros, exceções não tratadas e telemetria de incidentes de forma automática.

---

## 1. Visão Geral da API

- **Base URL (Produção):** `https://ltisistemas.vercel.app`
- **Base URL (Desenvolvimento):** `http://localhost:3000`
- **Formato do Código do Incidente:** `LTI-BUG-XXXXXX-YYYY-MM-DD-HH-MM` (ex: `LTI-BUG-000042-2026-09-21-16-30`)
- **SLA Padrão de Atendimento:** 6 horas úteis para primeira análise técnica.
- **Deduplicação Inteligente:** Se um incidente idêntico estiver em aberto (`ABERTO` ou `PENDENTE`), a API **não cria chamados duplicados**; ela incrementa o contador de ocorrências (`occurrenceCount`) e anexa o novo stack-trace e payload na linha do tempo de telemetria.

---

## 2. Métodos de Autenticação

A API aceita duas formas seguras de autenticação:

### Opção A: API-Key Segura (Recomendado para Backends, APIs e Lambdas)
Envie sua chave de API (iniciada com `lti_live_`) no cabeçalho `x-api-key` ou via Bearer token:
```http
x-api-key: lti_live_abcdef1234567890abcdef1234567890
```
*ou*
```http
Authorization: Bearer lti_live_abcdef1234567890abcdef1234567890
```

### Opção B: Login via API (Geração de Token JWT)
Faça um POST em `/api/v1/auth/login` com email e senha da conta de cliente para obter um Bearer Token com validade de sessão.

---

## 3. Catálogo de Endpoints

### 3.1. Autenticação — `POST /api/v1/auth/login`

Gera um token de acesso para sistemas que preferem autenticação baseada em credenciais.

#### Requisição
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "cliente@suaempresa.com.br",
  "password": "suaSenhaSegura123"
}
```

#### Resposta de Sucesso (`200 OK`)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": "cly1234567890",
    "name": "Nome do Solicitante",
    "email": "cliente@suaempresa.com.br",
    "company": "Sua Empresa S.A.",
    "role": "CLIENTE"
  }
}
```

---

### 3.2. Registro de Incidente — `POST /api/v1/incidents`

Registra um novo chamado ou adiciona uma ocorrência com telemetria a um chamado existente.

#### Cabeçalhos Obrigatórios
- `Content-Type: application/json`
- `x-api-key: lti_live_...` (ou `Authorization: Bearer <token | api_key>`)

#### Parâmetros do Payload

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `title` | `string` | **Sim** | Título resumido do incidente (ex: `Falha 500 no checkout`) |
| `screenName` | `string` | **Sim** | Nome da tela, módulo ou microsserviço (ex: `Tela de Checkout`, `OrderService`) |
| `description` | `string` | **Sim** | Descrição do problema ou mensagem de erro |
| `origin` | `string` | Não | Origem do erro: `FRONT`, `BACK`, `INFRA`, `EVENT` ou `OUTROS` (padrão: `OUTROS`) |
| `errorLog` | `string` | Não | Stack-trace completo ou log de erro técnico |
| `payload` | `object \| string` | Não | JSON com dados de contexto da requisição (senhas e tokens são mascarados automaticamente) |
| `sourceUrl` | `string` | Não | URL da página ou endpoint de origem (ex: `https://app.empresa.com/carrinho`) |
| `targetUrl` | `string` | Não | URL externa ou de destino que falhou (ex: `https://api.gateway.com/charges`) |
| `occurredAt` | `string` | Não | Data/hora do evento em formato ISO 8601 (padrão: data/hora atual do servidor) |

#### Exemplo de Requisição
```json
{
  "title": "Erro 500 ao processar pagamento",
  "screenName": "Módulo Financeiro / Checkout",
  "description": "Exceção não tratada ao chamar o gateway de pagamentos via webhook.",
  "origin": "BACK",
  "sourceUrl": "https://app.suaempresa.com.br/checkout",
  "targetUrl": "https://api.pagamentos.com/v1/charge",
  "errorLog": "GuzzleHttp\\Exception\\ServerException: Server error: `POST https://api.pagamentos.com/v1/charge` resulted in a `500 Internal Server Error`\n  at app/Services/PaymentService.php:84",
  "payload": {
    "orderId": 48201,
    "amount": 299.90,
    "gateway": "Stone"
  }
}
```

#### Resposta de Criação de Novo Chamado (`201 Created`)
```json
{
  "success": true,
  "isNew": true,
  "ticketId": "clt100200300",
  "ticketNumber": 105,
  "code": "LTI-BUG-000105-2026-09-21-16-30",
  "occurrenceCount": 1,
  "occurrenceId": "occ_987654",
  "status": "ABERTO",
  "slaDueAt": "2026-09-21T22:30:00.000Z",
  "message": "Incidente registrado com sucesso."
}
```

#### Resposta de Ocorrência Agrupada (`200 OK`)
```json
{
  "success": true,
  "isNew": false,
  "ticketId": "clt100200300",
  "ticketNumber": 105,
  "code": "LTI-BUG-000105-2026-09-21-16-30",
  "occurrenceCount": 8,
  "occurrenceId": "occ_987655",
  "status": "ABERTO",
  "slaDueAt": "2026-09-21T22:30:00.000Z",
  "message": "Ocorrência associada ao incidente existente com sucesso."
}
```

---

## 4. Exemplos de Implementação por Linguagem

---

### 4.1. cURL (Terminal / Bash)

#### Registro Direto com API Key
```bash
curl -X POST "https://ltisistemas.vercel.app/api/v1/incidents" \
  -H "Content-Type: application/json" \
  -H "x-api-key: lti_live_SEU_TOKEN_AQUI" \
  -d '{
    "title": "Falha na conexão com banco secundário",
    "screenName": "Serviço de Relatórios",
    "description": "Timeout excedido após 30 segundos de espera.",
    "origin": "INFRA",
    "errorLog": "PDOException: SQLSTATE[HY000] [2002] Connection timed out in /var/www/reports.php:12",
    "payload": { "database": "reports_replica", "port": 5432 }
  }'
```

#### Autenticação por Login e Registro
```bash
# 1. Login
TOKEN=$(curl -s -X POST "https://ltisistemas.vercel.app/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "cliente@empresa.com", "password": "senha"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. Registrar Incidente com o Bearer Token
curl -X POST "https://ltisistemas.vercel.app/api/v1/incidents" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Erro na sincronização de estoque",
    "screenName": "Queue / SyncWorker",
    "description": "Falha no worker de fila ao processar SKU 99201",
    "origin": "EVENT",
    "errorLog": "Exception: Stock quantity cannot be negative"
  }'
```

---

### 4.2. PHP Puro (Vanilla PHP / cURL)

Crie uma classe utilitária e utilize no seu manipulador global de exceções:

```php
<?php
// LtiIncidentReporter.php

class LtiIncidentReporter
{
    private static string $apiUrl = 'https://ltisistemas.vercel.app/api/v1/incidents';
    private static string $apiKey = 'lti_live_SEU_TOKEN_AQUI'; // Configure via getenv('LTI_API_KEY')

    /**
     * Envia o incidente para a LTI Sistemas de forma segura.
     */
    public static function report(
        string $title,
        string $screenName,
        string $description,
        string $origin = 'BACK',
        ?string $errorLog = null,
        $payload = null,
        ?string $sourceUrl = null,
        ?string $targetUrl = null
    ): ?array {
        $body = [
            'title'       => $title,
            'screenName'  => $screenName,
            'description' => $description,
            'origin'      => $origin, // 'FRONT', 'BACK', 'INFRA', 'EVENT', 'OUTROS'
            'errorLog'    => $errorLog,
            'payload'     => $payload,
            'sourceUrl'   => $sourceUrl ?? ($_SERVER['REQUEST_URI'] ?? null),
            'targetUrl'   => $targetUrl,
            'occurredAt'  => date('c'),
        ];

        $ch = curl_init(self::$apiUrl);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 4, // Timeout curto para não travar a requisição do usuário
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'x-api-key: ' . self::$apiKey,
            ],
            CURLOPT_POSTFIELDS     => json_encode($body),
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response && ($httpCode === 200 || $httpCode === 201)) {
            return json_decode($response, true);
        }

        return null;
    }

    /**
     * Capturador global de exceções do PHP.
     */
    public static function registerExceptionHandler(string $appName = 'Meu Sistema PHP'): void
    {
        set_exception_handler(function (Throwable $e) use ($appName) {
            self::report(
                title: 'Exceção não tratada: ' . get_class($e) . ' - ' . $e->getMessage(),
                screenName: $appName . ' (' . basename($e->getFile()) . ':' . $e->getLine() . ')',
                description: 'Erro em ' . $e->getFile() . ' na linha ' . $e->getLine() . ': ' . $e->getMessage(),
                origin: 'BACK',
                errorLog: $e->getTraceAsString(),
                payload: [
                    'GET'  => $_GET ?? [],
                    'POST' => $_POST ?? [],
                ]
            );
        });
    }
}

// Exemplo de Uso Manual no seu código PHP:
/*
try {
    // Operação crítica...
    throw new Exception("Falha ao consultar API externa");
} catch (Exception $e) {
    LtiIncidentReporter::report(
        title: "Erro ao consultar API externa",
        screenName: "Módulo de Vendas",
        description: $e->getMessage(),
        origin: "BACK",
        errorLog: $e->getTraceAsString(),
        payload: ['userId' => 1234]
    );
}
*/
```

---

### 4.3. Laravel (PHP Framework)

#### Passo 1: Configuração em `.env` e `config/services.php`

No seu arquivo `.env`:
```env
LTI_API_KEY=lti_live_SEU_TOKEN_AQUI
LTI_API_URL=https://ltisistemas.vercel.app/api/v1/incidents
```

No seu arquivo `config/services.php`:
```php
'lti' => [
    'api_key' => env('LTI_API_KEY'),
    'url'     => env('LTI_API_URL', 'https://ltisistemas.vercel.app/api/v1/incidents'),
],
```

#### Passo 2: Service no Laravel (`app/Services/LtiIncidentService.php`)

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class LtiIncidentService
{
    /**
     * Envia incidente para a API da LTI Sistemas.
     */
    public static function report(
        string $title,
        string $screenName,
        string $description,
        string $origin = 'BACK',
        ?string $errorLog = null,
        $payload = null,
        ?string $sourceUrl = null,
        ?string $targetUrl = null
    ): void {
        $apiKey = config('services.lti.api_key');
        $apiUrl = config('services.lti.url');

        if (!$apiKey) {
            return;
        }

        try {
            Http::timeout(3)
                ->withHeaders([
                    'x-api-key' => $apiKey,
                    'Accept'    => 'application/json',
                ])
                ->post($apiUrl, [
                    'title'       => $title,
                    'screenName'  => $screenName,
                    'description' => $description,
                    'origin'      => $origin,
                    'errorLog'    => $errorLog,
                    'payload'     => $payload,
                    'sourceUrl'   => $sourceUrl ?? request()->fullUrl(),
                    'targetUrl'   => $targetUrl,
                    'occurredAt'  => now()->toIso8601String(),
                ]);
        } catch (Throwable $e) {
            Log::warning("Falha ao registrar incidente na LTI Sistemas: " . $e->getMessage());
        }
    }

    /**
     * Converte uma Throwable do Laravel em um incidente LTI.
     */
    public static function reportException(Throwable $e, ?string $moduleName = null): void
    {
        self::report(
            title: '[' . class_basename($e) . '] ' . $e->getMessage(),
            screenName: $moduleName ?? (request()->route()?->getName() ?? 'Laravel Backend'),
            description: $e->getMessage() . ' em ' . $e->getFile() . ':' . $e->getLine(),
            origin: 'BACK',
            errorLog: $e->getTraceAsString(),
            payload: [
                'user_id' => auth()->id(),
                'ip'      => request()->ip(),
                'inputs'  => request()->except(['password', 'password_confirmation', 'token', 'credit_card']),
            ]
        );
    }
}
```

#### Passo 3: Integração no Handler Global do Laravel

- **No Laravel 11+ (`bootstrap/app.php`):**
```php
use App\Services\LtiIncidentService;

return Application::configure(basePath: dirname(__DIR__))
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $e) {
            if (app()->environment('production')) {
                LtiIncidentService::reportException($e);
            }
        });
    })->create();
```

- **No Laravel 9/10 (`app/Exceptions/Handler.php`):**
```php
public function register(): void
{
    $this->reportable(function (Throwable $e) {
        if (app()->environment('production')) {
            \App\Services\LtiIncidentService::reportException($e);
        }
    });
}
```

---

### 4.4. Python (Django, FastAPI, Flask ou Scripts)

Crie o módulo `lti_reporter.py`:

```python
import sys
import traceback
import requests
from datetime import datetime

LTI_API_KEY = "lti_live_SEU_TOKEN_AQUI"
LTI_API_URL = "https://ltisistemas.vercel.app/api/v1/incidents"

def report_incident(
    title: str,
    screen_name: str,
    description: str,
    origin: str = "BACK",
    error_log: str = None,
    payload: dict = None,
    source_url: str = None,
    target_url: str = None,
    timeout: float = 3.5,
) -> dict:
    """
    Envia incidente para a API da LTI Sistemas de forma segura e não bloqueante.
    """
    headers = {
        "Content-Type": "application/json",
        "x-api-key": LTI_API_KEY,
    }

    body = {
        "title": title,
        "screenName": screen_name,
        "description": description,
        "origin": origin,  # "FRONT", "BACK", "INFRA", "EVENT", "OUTROS"
        "errorLog": error_log,
        "payload": payload,
        "sourceUrl": source_url,
        "targetUrl": target_url,
        "occurredAt": datetime.utcnow().isoformat() + "Z",
    }

    try:
        response = requests.post(LTI_API_URL, json=body, headers=headers, timeout=timeout)
        if response.status_code in (200, 201):
            return response.json()
    except Exception as err:
        print(f"[LTI Telemetry] Falha ao enviar telemetria: {err}", file=sys.stderr)

    return None

def install_global_excepthook(app_name: str = "Python Application"):
    """
    Instala capturador global para qualquer exceção não tratada no Python.
    """
    def custom_excepthook(exc_type, exc_value, exc_traceback):
        trace_str = "".join(traceback.format_exception(exc_type, exc_value, exc_traceback))
        report_incident(
            title=f"Unhandled {exc_type.__name__}: {str(exc_value)}",
            screen_name=app_name,
            description=str(exc_value),
            origin="BACK",
            error_log=trace_str,
        )
        sys.__excepthook__(exc_type, exc_value, exc_traceback)

    sys.excepthook = custom_excepthook

# Exemplo de Uso:
if __name__ == "__main__":
    # Teste de envio
    res = report_incident(
        title="Falha ao sincronizar dados com parceiro",
        screen_name="Worker Celery / Sync",
        description="Servidor do parceiro retornou 503 Service Unavailable",
        origin="EVENT",
        payload={"batch_id": "batch_9812", "records_count": 500}
    )
    print("Resultado:", res)
```

---

### 4.5. Next.js / TypeScript / Node.js

#### Utilitário Cliente (`lib/lti-telemetry.ts`):

```typescript
// lib/lti-telemetry.ts

export interface LtiIncidentPayload {
  title: string;
  screenName: string;
  description: string;
  origin?: "FRONT" | "BACK" | "INFRA" | "EVENT" | "OUTROS";
  errorLog?: string;
  payload?: any;
  sourceUrl?: string;
  targetUrl?: string;
}

const LTI_API_URL = process.env.NEXT_PUBLIC_LTI_API_URL || "https://ltisistemas.vercel.app/api/v1/incidents";
const LTI_API_KEY = process.env.LTI_API_KEY || process.env.NEXT_PUBLIC_LTI_API_KEY || "lti_live_SEU_TOKEN_AQUI";

/**
 * Envia um incidente para a LTI Sistemas.
 */
export async function reportLtiIncident(data: LtiIncidentPayload) {
  try {
    const res = await fetch(LTI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": LTI_API_KEY,
      },
      body: JSON.stringify({
        ...data,
        origin: data.origin || "BACK",
        sourceUrl: data.sourceUrl || (typeof window !== "undefined" ? window.location.href : undefined),
        occurredAt: new Date().toISOString(),
      }),
      // Não bloqueia requisições em edge/node
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      console.warn("[LTI Telemetry] Status HTTP:", res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("[LTI Telemetry] Erro ao enviar incidente:", error);
    return null;
  }
}
```

#### Uso em Server Actions / API Routes do Next.js:
```typescript
import { reportLtiIncident } from "@/lib/lti-telemetry";

export async function processOrderAction(orderData: any) {
  try {
    // Executa regra de negócio...
    throw new Error("Saldo insuficiente no cartão");
  } catch (error: any) {
    // Registra telemetria de erro automaticamente
    await reportLtiIncident({
      title: `Erro ao processar pedido: ${error.message}`,
      screenName: "ServerAction: processOrderAction",
      description: error.message || "Erro desconhecido",
      origin: "BACK",
      errorLog: error.stack,
      payload: { orderData },
    });

    return { success: false, error: "Não foi possível concluir o pedido." };
  }
}
```

#### Uso no React Error Boundary (Frontend):
```tsx
"use client";

import { Component, ReactNode } from "react";
import { reportLtiIncident } from "@/lib/lti-telemetry";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    reportLtiIncident({
      title: `Crash React Frontend: ${error.message}`,
      screenName: window.location.pathname,
      description: error.message,
      origin: "FRONT",
      errorLog: `${error.stack}\nComponent Stack: ${errorInfo?.componentStack}`,
      sourceUrl: window.location.href,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-gray-50 border rounded-xl m-4">
          <h2 className="font-bold text-lg text-gray-900">Algo deu errado</h2>
          <p className="text-sm text-gray-600">O incidente foi registrado automaticamente para nosso suporte.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 5. Boas Práticas de Produção

1. **Timeout Curto:** Mantenha sempre o timeout das requisições de telemetria entre 3 a 5 segundos para que uma eventual oscilação de rede nunca impacte a experiência do usuário final da sua aplicação.
2. **Sanitização de Senhas:** A API da LTI Sistemas mascara automaticamente campos como `password`, `token`, `secret` e `creditCard`, mas como boa prática, evite enviar dados pessoais sensíveis (LGPD) nos payloads de telemetria.
3. **Origem Correta:** Informe a origem correta (`FRONT`, `BACK`, `INFRA`, `EVENT`) para que a equipe de suporte e os filtros do painel categorizem e priorizem o atendimento com agilidade.
4. **Agrupamento Automático:** Não se preocupe em criar lógicas complexas de repetição no seu sistema: envie o evento sempre que o erro acontecer. A API se encarrega de agrupar as ocorrências no mesmo chamado e atualizar os contadores em tempo real.
