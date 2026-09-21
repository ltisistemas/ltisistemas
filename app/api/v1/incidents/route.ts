import { NextResponse } from "next/server";
import { authenticateApiRequest } from "@/lib/auth/api-auth-middleware";
import { ingestIncidentService } from "@/lib/services/incident-ingestion";

export async function POST(request: Request) {
  try {
    const session = await authenticateApiRequest(request);
    if (!session) {
      return NextResponse.json(
        {
          error:
            "Não autorizado. Por favor forneça o cabeçalho 'x-api-key' ou 'Authorization: Bearer <token>'.",
        },
        { status: 401 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido. JSON esperado." },
        { status: 400 }
      );
    }

    const {
      title,
      screenName,
      description,
      origin,
      sourceUrl,
      targetUrl,
      occurredAt,
      errorLog,
      payload,
      headers,
    } = body || {};

    if (!title || !screenName || !description) {
      return NextResponse.json(
        {
          error:
            "Campos obrigatórios ausentes: 'title', 'screenName' e 'description' são requeridos.",
        },
        { status: 400 }
      );
    }

    const result = await ingestIncidentService({
      userId: session.userId,
      title,
      screenName,
      description,
      origin,
      sourceUrl,
      targetUrl,
      occurredAt,
      errorLog,
      payload,
      headers,
    });

    return NextResponse.json(
      {
        success: true,
        isNew: result.isNew,
        ticketId: result.ticketId,
        ticketNumber: result.ticketNumber,
        code: result.code,
        occurrenceCount: result.occurrenceCount,
        occurrenceId: result.occurrenceId,
        status: result.status,
        slaDueAt: result.slaDueAt,
        message: result.isNew
          ? "Incidente registrado com sucesso."
          : "Ocorrência associada ao incidente existente com sucesso.",
      },
      { status: result.isNew ? 201 : 200 }
    );
  } catch (error: any) {
    console.error("API /api/v1/incidents error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor ao processar incidente." },
      { status: 500 }
    );
  }
}
