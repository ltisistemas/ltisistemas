import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/v1/incidents/route";
import * as authMiddlewareModule from "@/lib/auth/api-auth-middleware";
import * as ingestionServiceModule from "@/lib/services/incident-ingestion";
import { Role, TicketStatus } from "@prisma/client";

describe("API /api/v1/incidents", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockSession = {
    userId: "usr_client_99",
    name: "Client Test",
    email: "client@test.com",
    company: "Client Test S.A.",
    role: Role.CLIENTE,
  };

  it("should return 401 when request is unauthenticated", async () => {
    vi.spyOn(authMiddlewareModule, "authenticateApiRequest").mockResolvedValue(null);

    const req = new Request("http://localhost:3000/api/v1/incidents", {
      method: "POST",
      body: JSON.stringify({ title: "Test", screenName: "Screen", description: "Desc" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toContain("Não autorizado");
  });

  it("should return 400 when request body is not valid JSON", async () => {
    vi.spyOn(authMiddlewareModule, "authenticateApiRequest").mockResolvedValue(mockSession as any);

    const req = new Request("http://localhost:3000/api/v1/incidents", {
      method: "POST",
      body: "not-json-content",
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 400 when required fields are missing", async () => {
    vi.spyOn(authMiddlewareModule, "authenticateApiRequest").mockResolvedValue(mockSession as any);

    const req = new Request("http://localhost:3000/api/v1/incidents", {
      method: "POST",
      body: JSON.stringify({ title: "Only Title" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Campos obrigatórios ausentes");
  });

  it("should return 201 when new incident is ingested", async () => {
    vi.spyOn(authMiddlewareModule, "authenticateApiRequest").mockResolvedValue(mockSession as any);

    vi.spyOn(ingestionServiceModule, "ingestIncidentService").mockResolvedValue({
      success: true,
      isNew: true,
      ticketId: "tkt_new_1",
      ticketNumber: 42,
      code: "LTI-BUG-000042-2026-09-21-16-00",
      occurrenceCount: 1,
      occurrenceId: "occ_1",
      status: TicketStatus.ABERTO,
      slaDueAt: new Date(),
    });

    const req = new Request("http://localhost:3000/api/v1/incidents", {
      method: "POST",
      body: JSON.stringify({
        title: "Crash no checkout",
        screenName: "Tela de Pagamento",
        description: "Falha de comunicação",
        origin: "FRONT",
        sourceUrl: "https://shop.com/checkout",
        errorLog: "Error: Unhandled exception",
        payload: { cartId: "123" },
      }),
      headers: { "Content-Type": "application/json", "x-api-key": "lti_live_key" },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.isNew).toBe(true);
    expect(json.code).toBe("LTI-BUG-000042-2026-09-21-16-00");
    expect(json.ticketId).toBe("tkt_new_1");
  });

  it("should return 200 when recurring incident is grouped into existing active ticket", async () => {
    vi.spyOn(authMiddlewareModule, "authenticateApiRequest").mockResolvedValue(mockSession as any);

    vi.spyOn(ingestionServiceModule, "ingestIncidentService").mockResolvedValue({
      success: true,
      isNew: false,
      ticketId: "tkt_existing_1",
      ticketNumber: 42,
      code: "LTI-BUG-000042-2026-09-21-16-00",
      occurrenceCount: 5,
      occurrenceId: "occ_5",
      status: TicketStatus.ABERTO,
      slaDueAt: new Date(),
    });

    const req = new Request("http://localhost:3000/api/v1/incidents", {
      method: "POST",
      body: JSON.stringify({
        title: "Crash no checkout",
        screenName: "Tela de Pagamento",
        description: "Falha recorrente",
        origin: "FRONT",
      }),
      headers: { "Content-Type": "application/json", "x-api-key": "lti_live_key" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.isNew).toBe(false);
    expect(json.occurrenceCount).toBe(5);
  });
});
