import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/v1/auth/login/route";
import { prisma } from "@/lib/db/prisma";
import * as passwordModule from "@/lib/auth/password";
import { Role, UserStatus } from "@prisma/client";

describe("API /api/v1/auth/login", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 400 when request body is not valid JSON", async () => {
    const req = new Request("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      body: "invalid-json",
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Corpo da requisição inválido");
  });

  it("should return 400 when email or password is missing", async () => {
    const req = new Request("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("obrigatórios");
  });

  it("should return 401 when user is not found or inactive", async () => {
    vi.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

    const req = new Request("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "unknown@example.com", password: "password123" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toContain("Credenciais inválidas");
  });

  it("should return 401 when password does not match", async () => {
    vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
      id: "usr_1",
      name: "João",
      email: "joao@example.com",
      company: "Empresa",
      contractNumber: null,
      systemUrl: null,
      status: UserStatus.ATIVO,
      role: Role.CLIENTE,
      passwordHash: "stored_hash",
      deletedAt: null,
    } as any);

    vi.spyOn(passwordModule, "verifyPassword").mockResolvedValue(false);

    const req = new Request("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "joao@example.com", password: "wrong_password" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 200 with Bearer JWT token when credentials are valid", async () => {
    vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
      id: "usr_1",
      name: "João",
      email: "joao@example.com",
      company: "Empresa S.A.",
      contractNumber: "CTR-123",
      systemUrl: "https://empresa.com",
      status: UserStatus.ATIVO,
      role: Role.CLIENTE,
      passwordHash: "valid_hash",
      deletedAt: null,
    } as any);

    vi.spyOn(passwordModule, "verifyPassword").mockResolvedValue(true);

    const req = new Request("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "joao@example.com", password: "correct_password" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.token).toBeDefined();
    expect(json.tokenType).toBe("Bearer");
    expect(json.user.name).toBe("João");
    expect(json.user.company).toBe("Empresa S.A.");
  });

  it("should return 500 when an unexpected internal error occurs", async () => {
    vi.spyOn(prisma.user, "findUnique").mockRejectedValue(new Error("DB_CRASH"));

    const req = new Request("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "joao@example.com", password: "correct_password" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
