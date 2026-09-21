import { PrismaClient, Role, UserStatus } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const email = "luizdantasdesign@gmail.com";
  const name = "Luiz Felipe Marinho Dantas";
  const rawPassword = "sEnha@004";
  const company = "LTI Sistemas";

  console.log(`Hashing password with Argon2id + Pepper for ${email}...`);
  const passwordHash = await hashPassword(rawPassword);

  console.log(`Upserting support user ${email}...`);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      company,
      role: Role.SUPORTE,
      status: UserStatus.ATIVO,
      passwordHash,
      deletedAt: null,
    },
    create: {
      name,
      email,
      company,
      role: Role.SUPORTE,
      status: UserStatus.ATIVO,
      passwordHash,
      contractNumber: "SUP-01",
      systemUrl: "https://ltisistemas.com",
    },
  });

  console.log("Support user successfully created/updated:");
  console.log({
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company,
    role: user.role,
    status: user.status,
    contractNumber: user.contractNumber,
    systemUrl: user.systemUrl,
  });
}

main()
  .catch((e) => {
    console.error("Error creating support user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
