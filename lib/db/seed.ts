import { prisma } from "./prisma";
import { hashPassword } from "../auth/password";

export async function seedDatabase() {
  console.log("Seeding database...");

  // Support Admin Account
  const supportEmail = process.env.INITIAL_ADMIN_EMAIL || "suporte@ltisistemas.com";
  const supportPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@LTI2026!";

  const existingSupport = await prisma.user.findUnique({
    where: { email: supportEmail },
  });

  if (!existingSupport) {
    const passwordHash = await hashPassword(supportPassword);
    await prisma.user.create({
      data: {
        name: "Luiz Felipe (Suporte LTI)",
        email: supportEmail,
        company: "LTI Sistemas",
        contractNumber: "LTI-ADMIN-01",
        role: "SUPORTE",
        passwordHash,
      },
    });
    console.log(`Created default SUPORTE account: ${supportEmail} / ${supportPassword}`);
  } else {
    console.log(`SUPORTE account already exists: ${supportEmail}`);
  }

  // Demo Client Account
  const clientEmail = "cliente@empresa.com";
  const clientPassword = "Cliente@LTI2026!";

  const existingClient = await prisma.user.findUnique({
    where: { email: clientEmail },
  });

  if (!existingClient) {
    const passwordHash = await hashPassword(clientPassword);
    const clientUser = await prisma.user.create({
      data: {
        name: "Cliente Demonstração",
        email: clientEmail,
        company: "Tech Corp Ltda",
        contractNumber: "CTR-2026-001",
        role: "CLIENTE",
        passwordHash,
      },
    });
    console.log(`Created demo CLIENTE account: ${clientEmail} / ${clientPassword}`);

    // Optional sample ticket for demonstration
    const sampleTicket = await prisma.ticket.create({
      data: {
        title: "Dúvida na integração da API de pagamentos",
        description: "Estamos com dúvida sobre o webhook de retorno de status de transações. Poderiam verificar a documentação técnica para o ambiente de homologação?",
        status: "ABERTO",
        userId: clientUser.id,
      },
    });
    console.log(`Created sample demo ticket: #${sampleTicket.ticketNumber}`);
  } else {
    console.log(`Demo CLIENTE account already exists: ${clientEmail}`);
  }

  console.log("Database seed completed successfully.");
}

// Run if called directly
if (require.main === module || process.argv[1]?.includes("seed")) {
  seedDatabase()
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
