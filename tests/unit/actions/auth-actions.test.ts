import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  loginAction,
  logoutAction,
  getCurrentUserAction,
  createUserAction,
  listUsersAction,
  deleteUserAction,
  toggleUserStatusAction,
} from "@/lib/actions/auth-actions";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@prisma/client";
import * as sessionModule from "@/lib/auth/session";
import * as passwordModule from "@/lib/auth/password";

describe("lib/actions/auth-actions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("loginAction", () => {
    it("should return error if email or password are missing", async () => {
      const res1 = await loginAction("", "123456");
      expect(res1.success).toBe(false);
      expect(res1.error).toContain("informe seu e-mail e sua senha");

      const res2 = await loginAction("test@lti.com", "");
      expect(res2.success).toBe(false);
      expect(res2.error).toContain("informe seu e-mail e sua senha");
    });

    it("should return error if user is not found in database", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      const res = await loginAction("notfound@lti.com", "pass123");
      expect(res.success).toBe(false);
      expect(res.error).toContain("E-mail ou senha incorretos");
    });

    it("should return error if password verification fails", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "usr_1",
        name: "Luiz",
        email: "luiz@lti.com",
        company: "LTI",
        contractNumber: "01",
        role: Role.CLIENTE,
        passwordHash: "some_hash",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.spyOn(passwordModule, "verifyPassword").mockResolvedValue(false);

      const res = await loginAction("luiz@lti.com", "wrongpass");
      expect(res.success).toBe(false);
      expect(res.error).toContain("E-mail ou senha incorretos");
    });

    it("should handle unexpected error in loginAction", async () => {
      vi.spyOn(prisma.user, "findUnique").mockRejectedValue(new Error("DB_FATAL"));

      const res = await loginAction("luiz@lti.com", "pass");
      expect(res.success).toBe(false);
      expect(res.error).toContain("Ocorreu um erro interno");
    });

    it("should reject login if user is soft-deleted", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "usr_1",
        name: "Luiz",
        email: "luiz@lti.com",
        company: "LTI",
        contractNumber: "01",
        systemUrl: null,
        status: "ATIVO",
        role: Role.CLIENTE,
        passwordHash: "valid_hash",
        deletedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await loginAction("luiz@lti.com", "pass");
      expect(res.success).toBe(false);
      expect(res.error).toContain("desativada");
    });

    it("should reject login if user status is INATIVO", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "usr_1",
        name: "Luiz",
        email: "luiz@lti.com",
        company: "LTI",
        contractNumber: "01",
        systemUrl: null,
        status: "INATIVO",
        role: Role.CLIENTE,
        passwordHash: "valid_hash",
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await loginAction("luiz@lti.com", "pass");
      expect(res.success).toBe(false);
      expect(res.error).toContain("inativa");
    });

    it("should successfully authenticate and return redirectUrl", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "usr_1",
        name: "Luiz",
        email: "luiz@lti.com",
        company: "LTI",
        contractNumber: "01",
        systemUrl: "https://sistema.cliente.com",
        status: "ATIVO",
        role: Role.SUPORTE,
        passwordHash: "valid_hash",
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.spyOn(passwordModule, "verifyPassword").mockResolvedValue(true);
      vi.spyOn(sessionModule, "createSession").mockResolvedValue();

      const res = await loginAction("luiz@lti.com", "correctpass");
      expect(res.success).toBe(true);
      expect(res.data?.role).toBe(Role.SUPORTE);
      expect(res.data?.redirectUrl).toBe("/suporte/chamados");
    });
  });

  describe("logoutAction", () => {
    it("should delete session and return success", async () => {
      vi.spyOn(sessionModule, "deleteSession").mockResolvedValue();

      const res = await logoutAction();
      expect(res.success).toBe(true);
    });

    it("should handle logout exception", async () => {
      vi.spyOn(sessionModule, "deleteSession").mockRejectedValue(new Error("COOKIE_FAIL"));

      const res = await logoutAction();
      expect(res.success).toBe(false);
      expect(res.error).toContain("Erro ao encerrar sessão");
    });
  });

  describe("getCurrentUserAction", () => {
    it("should return active session user from getSession", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "u123",
        name: "Luiz",
        email: "luiz@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      const user = await getCurrentUserAction();
      expect(user?.userId).toBe("u123");
    });
  });

  describe("createUserAction", () => {
    it("should reject creation if caller is not SUPORTE", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("FORBIDDEN"));

      const res = await createUserAction({
        name: "User",
        email: "user@test.com",
        company: "Test",
        role: Role.CLIENTE,
        password: "password123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("permissão de SUPORTE");
    });

    it("should reject creation with missing required fields", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      const res = await createUserAction({
        name: "",
        email: "user@test.com",
        company: "LTI",
        role: Role.CLIENTE,
        password: "password123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Preencha todos os campos obrigatórios");
    });

    it("should reject creation if password is shorter than 6 characters", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      const res = await createUserAction({
        name: "User",
        email: "user@test.com",
        company: "Test",
        role: Role.CLIENTE,
        password: "123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("mínimo 6 caracteres");
    });

    it("should reject creation with invalid role", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      const res = await createUserAction({
        name: "User",
        email: "user@test.com",
        company: "Test",
        role: "INVALID_ROLE" as any,
        password: "validpassword123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Perfil de usuário inválido");
    });

    it("should reject creation if email already exists", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "existing_id",
        name: "Existing",
        email: "existing@test.com",
        company: "Test",
        contractNumber: null,
        systemUrl: null,
        status: "ATIVO",
        role: Role.CLIENTE,
        passwordHash: "hash",
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await createUserAction({
        name: "Novo",
        email: "existing@test.com",
        company: "Test",
        role: Role.CLIENTE,
        password: "validpassword123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("já está cadastrado");
    });

    it("should successfully create user when all data is valid", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "findUnique").mockResolvedValue(null);
      vi.spyOn(passwordModule, "hashPassword").mockResolvedValue("hashed_pass");
      vi.spyOn(prisma.user, "create").mockResolvedValue({
        id: "new_usr_99",
        name: "Novo Cliente",
        email: "novo@cliente.com",
        company: "Cliente Corp",
        contractNumber: "CTR-99",
        systemUrl: "https://sistema.cliente.com",
        status: "ATIVO",
        role: Role.CLIENTE,
        passwordHash: "hashed_pass",
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await createUserAction({
        name: "Novo Cliente",
        email: "novo@cliente.com",
        company: "Cliente Corp",
        contractNumber: "CTR-99",
        systemUrl: "https://sistema.cliente.com",
        status: "ATIVO",
        role: Role.CLIENTE,
        password: "securepassword123",
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBe("new_usr_99");
      expect(res.data?.email).toBe("novo@cliente.com");
    });

    it("should handle unexpected error during user creation", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "findUnique").mockRejectedValue(new Error("DB_CONNECTION_FAIL"));

      const res = await createUserAction({
        name: "User",
        email: "user@test.com",
        company: "Test",
        role: Role.CLIENTE,
        password: "password123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Erro ao criar usuário");
    });
  });

  describe("listUsersAction", () => {
    it("should reject list users for non-support callers", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("FORBIDDEN"));

      const res = await listUsersAction();
      expect(res.success).toBe(false);
      expect(res.error).toContain("Acesso negado");
    });

    it("should list all users for support callers", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "findMany").mockResolvedValue([
        {
          id: "u1",
          name: "User 1",
          email: "u1@lti.com",
          company: "C1",
          contractNumber: "01",
          systemUrl: "https://app.c1.com",
          status: "ATIVO",
          role: Role.CLIENTE,
          passwordHash: "hash",
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { tickets: 3 },
        } as any,
      ]);

      const res = await listUsersAction();
      expect(res.success).toBe(true);
      expect(res.data?.length).toBe(1);
      expect(res.data?.[0].ticketsCount).toBe(3);
      expect(res.data?.[0].systemUrl).toBe("https://app.c1.com");
      expect(res.data?.[0].status).toBe("ATIVO");
    });
  });

  describe("deleteUserAction", () => {
    it("should reject delete if caller is not SUPORTE", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("FORBIDDEN"));

      const res = await deleteUserAction("u2");
      expect(res.success).toBe(false);
      expect(res.error).toContain("permissão de SUPORTE");
    });

    it("should prevent support user from deleting themselves", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      const res = await deleteUserAction("adm_1");
      expect(res.success).toBe(false);
      expect(res.error).toContain("não pode excluir seu próprio usuário");
    });

    it("should soft-delete user successfully", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "update").mockResolvedValue({} as any);

      const res = await deleteUserAction("cli_2");
      expect(res.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "cli_2" },
        data: expect.objectContaining({
          status: "INATIVO",
        }),
      });
    });

    it("should handle error during delete user", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "update").mockRejectedValue(new Error("DB_ERROR"));

      const res = await deleteUserAction("cli_2");
      expect(res.success).toBe(false);
      expect(res.error).toContain("Erro ao excluir usuário");
    });
  });

  describe("toggleUserStatusAction", () => {
    it("should toggle status when caller is SUPORTE", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "update").mockResolvedValue({} as any);

      const res = await toggleUserStatusAction("cli_3", "INATIVO");
      expect(res.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "cli_3" },
        data: { status: "INATIVO" },
      });
    });

    it("should reject toggle if caller is not SUPORTE", async () => {
      vi.spyOn(sessionModule, "requireSession").mockRejectedValue(new Error("FORBIDDEN"));

      const res = await toggleUserStatusAction("cli_3", "ATIVO");
      expect(res.success).toBe(false);
      expect(res.error).toContain("permissão de SUPORTE");
    });

    it("should handle database error in toggleUserStatusAction", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "adm_1",
        name: "Admin",
        email: "admin@lti.com",
        company: "LTI",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "update").mockRejectedValue(new Error("CRASH"));

      const res = await toggleUserStatusAction("cli_3", "INATIVO");
      expect(res.success).toBe(false);
      expect(res.error).toContain("Erro ao atualizar status");
    });
  });
});
