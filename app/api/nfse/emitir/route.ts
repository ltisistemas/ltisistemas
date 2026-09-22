import { NextRequest, NextResponse } from "next/server";
import { emitNfseAction } from "@/lib/actions/nfse-actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await emitNfseAction(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno ao processar emissão." },
      { status: 500 }
    );
  }
}
