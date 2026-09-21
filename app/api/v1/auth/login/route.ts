import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido. JSON esperado." },
        { status: 400 }
      );
    }

    const { email, password } = body || {};

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanPassword = typeof password === "string" ? password : "";

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        contractNumber: true,
        systemUrl: true,
        status: true,
        role: true,
        passwordHash: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt || user.status === "INATIVO") {
      return NextResponse.json(
        { error: "Credenciais inválidas ou usuário inativo." },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(cleanPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Credenciais inválidas ou usuário inativo." },
        { status: 401 }
      );
    }

    const token = await signSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      contractNumber: user.contractNumber,
      systemUrl: user.systemUrl,
      status: user.status,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        token,
        tokenType: "Bearer",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /api/v1/auth/login error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao autenticar." },
      { status: 500 }
    );
  }
}
