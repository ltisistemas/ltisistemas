import { NextRequest, NextResponse } from "next/server";
import { cancelNfseAction } from "@/lib/actions/nfse-actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await cancelNfseAction(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "NFS-e cancelada com sucesso." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno ao cancelar NFS-e." },
      { status: 500 }
    );
  }
}
