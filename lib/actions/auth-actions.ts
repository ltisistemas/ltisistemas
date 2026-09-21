"use server";

import { prisma } from "../db/prisma";
import { hashPassword, verifyPassword } from "../auth/password";
import { createSession, deleteSession, getSession, requireSession, SessionPayload } from "../auth/session";
import { Role } from "@prisma/client";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Authenticates user credentials and establishes a secure session.
 */
export async function loginAction(
  emailInput: string,
  passwordInput: string
): Promise<ActionResult<{ role: Role; redirectUrl: string }>> {
  try {
    const email = emailInput?.toLowerCase().trim();
    const password = passwordInput;

    if (!email || !password) {
      return { success: false, error: "Por favor, informe seu e-mail e sua senha." };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "E-mail ou senha incorretos." };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "E-mail ou senha incorretos." };
    }

    const payload: SessionPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      contractNumber: user.contractNumber,
      role: user.role,
    };

    await createSession(payload);

    return {
      success: true,
      data: {
        role: user.role,
        redirectUrl: "/suporte/chamados",
      },
    };
  } catch (error) {
    console.error("Login action error:", error);
    return { success: false, error: "Ocorreu um erro interno ao processar o login. Tente novamente." };
  }
}

/**
 * Destroys current session and logs out.
 */
export async function logoutAction(): Promise<ActionResult> {
  try {
    await deleteSession();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Erro ao encerrar sessão." };
  }
}

/**
 * Returns the currently active session user.
 */
export async function getCurrentUserAction(): Promise<SessionPayload | null> {
  return await getSession();
}

/**
 * Provisions a new user account (restricted exclusively to SUPORTE).
 */
export async function createUserAction(data: {
  name: string;
  email: string;
  company: string;
  contractNumber?: string;
  role: Role;
  password: string;
}): Promise<ActionResult<{ id: string; email: string; name: string }>> {
  try {
    const session = await requireSession(["SUPORTE"]);
    if (!session) {
      return { success: false, error: "Apenas usuários com perfil SUPORTE podem cadastrar novos usuários." };
    }

    const name = data.name?.trim();
    const email = data.email?.toLowerCase().trim();
    const company = data.company?.trim();
    const contractNumber = data.contractNumber?.trim() || null;
    const role = data.role;
    const password = data.password;

    if (!name || !email || !company || !password) {
      return { success: false, error: "Preencha todos os campos obrigatórios (Nome, E-mail, Empresa e Senha)." };
    }

    if (password.length < 6) {
      return { success: false, error: "A senha deve conter no mínimo 6 caracteres." };
    }

    if (!["SUPORTE", "CLIENTE"].includes(role)) {
      return { success: false, error: "Perfil de usuário inválido." };
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: "Este endereço de e-mail já está cadastrado no sistema." };
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        company,
        contractNumber,
        role,
        passwordHash,
      },
    });

    return {
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  } catch (error: any) {
    console.error("Create user error:", error);
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return { success: false, error: "Acesso negado: permissão de SUPORTE necessária." };
    }
    return { success: false, error: "Erro ao criar usuário. Verifique os dados e tente novamente." };
  }
}

/**
 * Lists all registered users (restricted exclusively to SUPORTE).
 */
export async function listUsersAction(): Promise<
  ActionResult<
    Array<{
      id: string;
      name: string;
      email: string;
      company: string;
      contractNumber: string | null;
      role: Role;
      createdAt: Date;
      ticketsCount: number;
    }>
  >
> {
  try {
    await requireSession(["SUPORTE"]);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });

    return {
      success: true,
      data: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        company: u.company,
        contractNumber: u.contractNumber,
        role: u.role,
        createdAt: u.createdAt,
        ticketsCount: u._count.tickets,
      })),
    };
  } catch (error) {
    console.error("List users error:", error);
    return { success: false, error: "Acesso negado ou erro ao listar usuários." };
  }
}
