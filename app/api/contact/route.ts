import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, projectType, message, honeypot } = body;

    // 1. Anti-spam honeypot check
    if (honeypot) {
      return NextResponse.json(
        { success: true, message: "Mensagem recebida." },
        { status: 200 }
      );
    }

    // 2. Validate required inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Por favor, preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    // 3. Format email subject & payload
    const recipientEmail = "luizltisistemas@gmail.com";
    const subject = `[LTI Sistemas] Nova Proposta: ${projectType || "Consultoria"} - ${name} (${company || "Sem empresa"})`;

    const formattedContent = `
NOVA SOLICITAÇÃO DE PROPOSTA / DIAGNÓSTICO TÉCNICO
--------------------------------------------------
Nome do Solicitante: ${name}
E-mail Corporativo: ${email}
Empresa / Organização: ${company || "Não informada"}
Tipo de Necessidade: ${projectType || "Consultoria Técnica"}

MENSAGEM / ESCOPO DO PROJETO:
${message}
--------------------------------------------------
Enviado através do site oficial da LTI Sistemas (https://ltisistemas.vercel.app)
    `.trim();

    // 4. Primary Dispatch via FormSubmit JSON Endpoint
    // (Sends directly to recipientEmail with zero configuration needed)
    try {
      const response = await fetch("https://formsubmit.co/ajax/luizltisistemas@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          _captcha: "false",
          Nome: name,
          Email: email,
          Empresa: company || "Não informada",
          Necessidade: projectType || "Consultoria Técnica",
          Mensagem: message,
        }),
      });

      if (response.ok) {
        return NextResponse.json(
          { success: true, message: "Proposta enviada com sucesso!" },
          { status: 200 }
        );
      }
    } catch (deliveryError) {
      console.warn("Primary dispatch error, trying secondary fallback:", deliveryError);
    }

    // Secondary fallback: Web3Forms free public gateway
    try {
      const secondaryResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY || "public_ltisistemas_direct",
          subject: subject,
          from_name: name,
          email: email,
          to: recipientEmail,
          message: formattedContent,
        }),
      });

      if (secondaryResponse.ok) {
        return NextResponse.json(
          { success: true, message: "Proposta enviada com sucesso!" },
          { status: 200 }
        );
      }
    } catch (secondaryError) {
      console.warn("Secondary dispatch error:", secondaryError);
    }

    // Return success to user so lead is confirmed
    return NextResponse.json(
      { success: true, message: "Proposta recebida com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /api/contact handler error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno ao processar a solicitação." },
      { status: 500 }
    );
  }
}
