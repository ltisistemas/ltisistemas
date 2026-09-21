import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createTicketAction,
  getTicketsAction,
  getTicketByIdAction,
  updateTicketStatusAction,
} from "@/lib/actions/ticket-actions";
import { prisma } from "@/lib/db/prisma";
import { Role, TicketStatus } from "@prisma/client";
import * as sessionModule from "@/lib/auth/session";

describe("lib/actions/ticket-actions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("createTicketAction", () => {
    it("should reject ticket creation with missing title or description", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      const res1 = await createTicketAction({ title: "", description: "Erro" });
      expect(res1.success).toBe(false);
      expect(res1.error).toContain("obrigatórios");

      const res2 = await createTicketAction({ title: "Título", description: "" });
      expect(res2.success).toBe(false);
      expect(res2.error).toContain("obrigatórios");
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
        description: "Desc",
        attachments: [
          { fileName: "arquivo.pdf", mimeType: "application/pdf", base64Data: "data:application/pdf;base64,123" },
        ],
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Apenas imagens são aceitas");
    });

    it("should successfully create ticket and persist attachments", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      vi.spyOn(prisma.ticket, "create").mockResolvedValue({
        id: "tkt_100",
        ticketNumber: 42,
        title: "Erro 500 no checkout",
        description: "Falha ao processar pagamento",
        status: TicketStatus.ABERTO,
        userId: "cli_1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await createTicketAction({
        title: "Erro 500 no checkout",
        description: "Falha ao processar pagamento",
        attachments: [
          { fileName: "print.png", mimeType: "image/png", base64Data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" },
        ],
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBe("tkt_100");
      expect(res.data?.ticketNumber).toBe(42);
    });
  });

  describe("getTicketsAction", () => {
    it("should restrict client to own tickets only", async () => {
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
          description: "Desc",
          status: TicketStatus.ABERTO,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { attachments: 1 },
          user: {
            id: "cli_1",
            name: "Cliente",
            company: "Empresa",
            contractNumber: "01",
            email: "cli@empresa.com",
          },
        } as any,
      ]);

      vi.spyOn(prisma.ticket, "count").mockResolvedValue(1);

      const res = await getTicketsAction("ALL");
      expect(res.success).toBe(true);
      expect(res.data?.tickets.length).toBe(1);

      // Verify Prisma query was filtered by userId
      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: "cli_1" }),
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

      // Verify Prisma query was NOT filtered by userId
      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: TicketStatus.PENDENTE },
        })
      );
    });
  });

  describe("getTicketByIdAction", () => {
    it("should return error if ticket does not exist", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_1",
        name: "Cliente",
        email: "cli@empresa.com",
        company: "Empresa",
        role: Role.CLIENTE,
      });

      vi.spyOn(prisma.ticket, "findUnique").mockResolvedValue(null);

      const res = await getTicketByIdAction("non_existent");
      expect(res.success).toBe(false);
      expect(res.error).toContain("não encontrado");
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
        description: "Privado",
        status: TicketStatus.ABERTO,
        userId: "cli_2_different_user",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: "cli_2_different_user",
          name: "Cliente 2",
          company: "Empresa 2",
          contractNumber: null,
          email: "cli2@empresa.com",
        },
        attachments: [],
      } as any);

      const res = await getTicketByIdAction("tkt_other");
      expect(res.success).toBe(false);
      expect(res.error).toContain("não tem permissão");
    });

    it("should allow client to view their own ticket with attachments", async () => {
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
        description: "Descrição",
        status: TicketStatus.ABERTO,
        userId: "cli_1",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: "cli_1",
          name: "Cliente 1",
          company: "Empresa 1",
          contractNumber: null,
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
      expect(res.data?.attachments.length).toBe(1);
    });
  });

  describe("updateTicketStatusAction", () => {
    it("should reject status update if caller is not SUPORTE", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("FORBIDDEN"));

      const res = await updateTicketStatusAction("tkt_1", TicketStatus.FECHADO);
      expect(res.success).toBe(false);
      expect(res.error).toContain("Apenas a equipe de SUPORTE");
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
  });
});
