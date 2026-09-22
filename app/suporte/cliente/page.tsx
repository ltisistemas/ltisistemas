import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { SupportHeader } from "@/components/suporte/SupportHeader";
import { ClientHub360View } from "@/components/suporte/ClientHub360View";

export const dynamic = "force-dynamic";

export default async function ClientePortalPage() {
  const session = await getSession();

  if (!session) {
    redirect("/suporte/login");
  }

  if (session.role === "SUPORTE") {
    redirect("/suporte/usuarios");
  }

  return (
    <div className="min-h-screen bg-[#f3f4f8]">
      <SupportHeader
        user={session}
        activeTab="cliente"
      />
      <ClientHub360View
        user={session}
        initialClientId={session.userId}
      />
    </div>
  );
}
