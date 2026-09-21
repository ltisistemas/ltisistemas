import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createTicketAction,
  getTicketsAction,
  getTicketByIdAction,
  updateTicketStatusAction,
  deleteTicketAction,
} from "@/lib/actions/ticket-actions";
import { prisma } from "@/lib/db/prisma";
import { Role, TicketStatus } from "@prisma/client";
import * as sessionModule from "@/lib/auth/session";

describe("lib/actions/ticket-actions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("createTicketAction", () => {
    it("should reject ticket creation with missing title, screenName or description", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      const res1 = await createTicketAction({ title: "", screenName: "Tela 1", description: "Erro" });
      expect(res1.success).toBe(false);
      expect(res1.error).toContain("obrigatórios");

      const res2 = await createTicketAction({ title: "Título", screenName: "", description: "Desc" });
      expect(res2.success).toBe(false);
      expect(res2.error).toContain("obrigatórios");

      const res3 = await createTicketAction({ title: "Título", screenName: "Tela 1", description: "" });
      expect(res3.success).toBe(false);
      expect(res3.error).toContain("obrigatórios");
    });

    it("should reject ticket creation with more than 3 attachments", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      const res = await createTicketAction({
        title: "Problema",
        screenName: "Tela Principal",
        description: "Desc",
        attachments: [
          { fileName: "1.png", mimeType: "image/png", base64Data: "data:image/png;base64,123" },
          { fileName: "2.png", mimeType: "image/png", base64Data: "data:image/png;base64,123" },
          { fileName: "3.png", mimeType: "image/png", base64Data: "data:image/png;base64,123" },
          { fileName: "4.png", mimeType: "image/png", base64Data: "data:image/png;base64,123" },
        ],
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("máximo 3 imagens");
    });

    it("should reject non-image attachments", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      const res = await createTicketAction({
        title: "Problema",
        screenName: "Tela de Checkout",
        description: "Desc",
        attachments: [
          { fileName: "arquivo.pdf", mimeType: "application/pdf", base64Data: "data:application/pdf;base64,123" },
        ],
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Apenas imagens são aceitas");
    });

    it("should reject attachments exceeding size limit", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      const giantBase64 = "data:image/png;base64," + "a".repeat(5 * 1024 * 1024);
      const res = await createTicketAction({
        title: "Problema",
        screenName: "Tela de Login",
        description: "Desc",
        attachments: [
          { fileName: "gigante.png", mimeType: "image/png", base64Data: giantBase64 },
        ],
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("excede o tamanho máximo");
    });

    it("should handle unauthorized session error in createTicketAction", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("UNAUTHORIZED"));

      const res = await createTicketAction({
        title: "Problema",
        screenName: "Tela",
        description: "Desc",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Sua sessão expirou");
    });

    it("should handle unexpected error in createTicketAction", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("DB_CRASH"));

      const res = await createTicketAction({
        title: "Problema",
        screenName: "Tela",
        description: "Desc",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Erro ao abrir chamado");
    });

    it("should successfully create ticket, calculate 6h SLA and persist screenName", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      const due = new Date(Date.now() + 6 * 3600 * 1000);
      vi.spyOn(prisma.ticket, "create").mockResolvedValue({
        id: "tkt_100",
        ticketNumber: 42,
        title: "Erro 500 no checkout",
        screenName: "Tela de Pagamento",
        description: "Falha ao processar pagamento",
        status: TicketStatus.ABERTO,
        slaDueAt: due,
        deletedAt: null,
        userId: "cli_1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await createTicketAction({
        title: "Erro 500 no checkout",
        screenName: "Tela de Pagamento",
        description: "Falha ao processar pagamento",
        attachments: [
          { fileName: "print.png", mimeType: "image/png", base64Data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" },
        ],
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBe("tkt_100");
      expect(res.data?.ticketNumber).toBe(42);
      expect(res.data?.code).toMatch(/^LTI-BUG-[A-Z0-9]{6}-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/);
      expect(res.data?.slaDueAt).toBeDefined();
    });

    it("should allow SUPORTE to create ticket for specific client using targetUserId", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "sup_1",
        name: "Suporte",
        email: "suporte@ltisistemas.com",
        company: "LTI Sistemas",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "cli_target",
        deletedAt: null,
      } as any);

      const createSpy = vi.spyOn(prisma.ticket, "create").mockResolvedValue({
        id: "tkt_101",
        ticketNumber: 43,
        title: "Problema do cliente",
        screenName: "Tela Inicial",
        description: "Suporte abrindo chamado para cliente",
        status: TicketStatus.ABERTO,
        slaDueAt: new Date(),
        deletedAt: null,
        userId: "cli_target",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const res = await createTicketAction({
        title: "Problema do cliente",
        screenName: "Tela Inicial",
        description: "Suporte abrindo chamado para cliente",
        targetUserId: "cli_target",
      });

      expect(res.success).toBe(true);
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "cli_target",
          }),
        })
      );
    });

    it("should reject SUPORTE ticket creation when target client does not exist or is deleted", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "sup_1",
        name: "Suporte",
        email: "suporte@ltisistemas.com",
        company: "LTI Sistemas",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      const res = await createTicketAction({
        title: "Problema",
        screenName: "Tela",
        description: "Desc",
        targetUserId: "cli_invalido",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Cliente selecionado não foi encontrado");
    });
  });

  describe("getTicketsAction", () => {
    it("should restrict client to own tickets only and filter deletedAt null", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      const findManySpy = vi.spyOn(prisma.ticket, "findMany").mockResolvedValue([
        {
          id: "tkt_1",
          ticketNumber: 1,
          title: "Chamado 1",
          screenName: "Tela de Clientes",
          description: "Desc",
          status: TicketStatus.ABERTO,
          slaDueAt: new Date(),
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { attachments: 1 },
          user: {
            id: "cli_1",
            name: "Cliente",
            company: "Empresa",
            contractNumber: "01",
            systemUrl: "https://app.empresa.com",
            email: "cli@empresa.com",
          },
        } as any,
      ]);

      vi.spyOn(prisma.ticket, "count").mockResolvedValue(1);

      const res = await getTicketsAction("ALL");
      expect(res.success).toBe(true);
      expect(res.data?.tickets.length).toBe(1);
      expect(res.data?.tickets[0].screenName).toBe("Tela de Clientes");
      expect(res.data?.tickets[0].code).toMatch(/^LTI-BUG-[A-Z0-9]{6}-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/);

      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: "cli_1", deletedAt: null }),
        })
      );
    });

    it("should allow SUPORTE to view all client tickets without userId restriction", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "sup_1",
        name: "Suporte",
        email: "suporte@ltisistemas.com",
        company: "LTI Sistemas",
        role: Role.SUPORTE,
      });

      const findManySpy = vi.spyOn(prisma.ticket, "findMany").mockResolvedValue([]);
      vi.spyOn(prisma.ticket, "count").mockResolvedValue(0);

      const res = await getTicketsAction(TicketStatus.PENDENTE);
      expect(res.success).toBe(true);

      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null, status: TicketStatus.PENDENTE },
        })
      );
    });

    it("should allow SUPORTE to filter tickets by clientId", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "sup_1",
        name: "Suporte",
        email: "suporte@ltisistemas.com",
        company: "LTI Sistemas",
        role: Role.SUPORTE,
      });

      const findManySpy = vi.spyOn(prisma.ticket, "findMany").mockResolvedValue([]);
      vi.spyOn(prisma.ticket, "count").mockResolvedValue(0);

      const res = await getTicketsAction("ALL", "cli_specific");
      expect(res.success).toBe(true);

      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null, userId: "cli_specific" },
        })
      );
    });

    it("should handle unauthorized error in getTicketsAction", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("UNAUTHORIZED"));

      const res = await getTicketsAction("ALL");
      expect(res.success).toBe(false);
      expect(res.error).toContain("Sua sessão expirou");
    });

    it("should handle database error in getTicketsAction", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("DB_ERROR"));

      const res = await getTicketsAction("ALL");
      expect(res.success).toBe(false);
      expect(res.error).toContain("Erro ao buscar chamados");
    });
  });

  describe("getTicketByIdAction", () => {
    it("should return error if ticket does not exist or is soft-deleted", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      vi.spyOn(prisma.ticket, "findUnique").mockResolvedValue(null);

      const res1 = await getTicketByIdAction("non_existent");
      expect(res1.success).toBe(false);
      expect(res1.error).toContain("não encontrado");

      vi.spyOn(prisma.ticket, "findUnique").mockResolvedValue({
        id: "deleted_tkt",
        deletedAt: new Date(),
      } as any);

      const res2 = await getTicketByIdAction("deleted_tkt");
      expect(res2.success).toBe(false);
      expect(res2.error).toContain("não encontrado ou excluído");
    });

    it("should enforce privacy isolation: forbid client from viewing another client ticket", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente 1",
        email: "cli1@empresa.com",
        company: "Empresa 1",
        role: Role.CLIENTE,
      });

      vi.spyOn(prisma.ticket, "findUnique").mockResolvedValue({
        id: "tkt_other",
        ticketNumber: 88,
        title: "Chamado de outro cliente",
        screenName: "Tela Secreta",
        description: "Privado",
        status: TicketStatus.ABERTO,
        slaDueAt: new Date(),
        deletedAt: null,
        userId: "cli_2_different_user",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: "cli_2_different_user",
          name: "Cliente 2",
          company: "Empresa 2",
          contractNumber: null,
          systemUrl: null,
          email: "cli2@empresa.com",
        },
        attachments: [],
      } as any);

      const res = await getTicketByIdAction("tkt_other");
      expect(res.success).toBe(false);
      expect(res.error).toContain("não tem permissão");
    });

    it("should allow client to view their own ticket with attachments, screenName and SLA", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente 1",
        email: "cli1@empresa.com",
        company: "Empresa 1",
        role: Role.CLIENTE,
      });

      vi.spyOn(prisma.ticket, "findUnique").mockResolvedValue({
        id: "tkt_mine",
        ticketNumber: 12,
        title: "Meu chamado",
        screenName: "Módulo Financeiro",
        description: "Descrição",
        status: TicketStatus.ABERTO,
        slaDueAt: new Date(),
        deletedAt: null,
        userId: "cli_1",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: "cli_1",
          name: "Cliente 1",
          company: "Empresa 1",
          contractNumber: null,
          systemUrl: "https://financeiro.app",
          email: "cli1@empresa.com",
        },
        attachments: [
          {
            id: "att_1",
            fileName: "print.png",
            mimeType: "image/png",
            base64Data: "data:image/png;base64,123",
            createdAt: new Date(),
          },
        ],
      } as any);

      const res = await getTicketByIdAction("tkt_mine");
      expect(res.success).toBe(true);
      expect(res.data?.id).toBe("tkt_mine");
      expect(res.data?.code).toMatch(/^LTI-BUG-[A-Z0-9]{6}-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/);
      expect(res.data?.screenName).toBe("Módulo Financeiro");
      expect(res.data?.attachments.length).toBe(1);
    });

    it("should handle unauthorized and db errors in getTicketByIdAction", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("UNAUTHORIZED"));
      const res1 = await getTicketByIdAction("1");
      expect(res1.success).toBe(false);
      expect(res1.error).toContain("Sua sessão expirou");

      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("DB_ERROR"));
      const res2 = await getTicketByIdAction("1");
      expect(res2.success).toBe(false);
      expect(res2.error).toContain("Erro ao carregar");
    });
  });

  describe("updateTicketStatusAction", () => {
    it("should reject status update if caller is not SUPORTE", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("FORBIDDEN"));

      const res = await updateTicketStatusAction("tkt_1", TicketStatus.FECHADO);
      expect(res.success).toBe(false);
      expect(res.error).toContain("Apenas a equipe de SUPORTE");
    });

    it("should reject invalid status value", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "sup_1",
        name: "Suporte",
        email: "sup@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      const res = await updateTicketStatusAction("tkt_1", "INVALID_STATUS" as any);
      expect(res.success).toBe(false);
      expect(res.error).toContain("Status inválido");
    });

    it("should successfully update status for SUPORTE", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "sup_1",
        name: "Suporte",
        email: "sup@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.ticket, "update").mockResolvedValue({
        id: "tkt_1",
        status: TicketStatus.FECHADO,
      } as any);

      const res = await updateTicketStatusAction("tkt_1", TicketStatus.FECHADO);
      expect(res.success).toBe(true);
      expect(res.data?.status).toBe(TicketStatus.FECHADO);
    });

    it("should handle db error in updateTicketStatusAction", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "sup_1",
        name: "Suporte",
        email: "sup@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.ticket, "update").mockRejectedValue(new Error("DB_CRASH"));

      const res = await updateTicketStatusAction("tkt_1", TicketStatus.FECHADO);
      expect(res.success).toBe(false);
      expect(res.error).toContain("Erro ao atualizar status");
    });
  });

  describe("deleteTicketAction", () => {
    it("should reject if ticket is not found", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      vi.spyOn(prisma.ticket, "findUnique").mockResolvedValue(null);

      const res = await deleteTicketAction("tkt_missing");
      expect(res.success).toBe(false);
      expect(res.error).toContain("não encontrado");
    });

    it("should reject client deleting other client ticket", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente 1",
        email: "cli1@empresa.com",
        company: "Empresa 1",
        role: Role.CLIENTE,
      });

      vi.spyOn(prisma.ticket, "findUnique").mockResolvedValue({
        id: "tkt_other",
        userId: "cli_2",
        deletedAt: null,
      } as any);

      const res = await deleteTicketAction("tkt_other");
      expect(res.success).toBe(false);
      expect(res.error).toContain("não tem permissão");
    });

    it("should allow ticket owner client to soft-delete ticket", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente 1",
        email: "cli1@empresa.com",
        company: "Empresa 1",
        role: Role.CLIENTE,
      });

      vi.spyOn(prisma.ticket, "findUnique").mockResolvedValue({
        id: "tkt_mine",
        userId: "cli_1",
        deletedAt: null,
      } as any);

      vi.spyOn(prisma.ticket, "update").mockResolvedValue({} as any);

      const res = await deleteTicketAction("tkt_mine");
      expect(res.success).toBe(true);
      expect(prisma.ticket.update).toHaveBeenCalledWith({
        where: { id: "tkt_mine" },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      });
    });

    it("should allow SUPORTE to soft-delete any ticket", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "sup_1",
        name: "Suporte",
        email: "sup@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.ticket, "findUnique").mockResolvedValue({
        id: "tkt_any",
        userId: "cli_99",
        deletedAt: null,
      } as any);

      vi.spyOn(prisma.ticket, "update").mockResolvedValue({} as any);

      const res = await deleteTicketAction("tkt_any");
      expect(res.success).toBe(true);
    });

    it("should handle error in deleteTicketAction", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("UNAUTHORIZED"));

      const res = await deleteTicketAction("tkt_1");
      expect(res.success).toBe(false);
      expect(res.error).toContain("Sua sessão expirou");
    });
  });
});

