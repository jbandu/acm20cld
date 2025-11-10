import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create test users
  const testUsers = [
    {
      email: "researcher@acm.com",
      password: "password123",
      name: "Test Researcher",
      role: "RESEARCHER" as const,
      department: "Cancer Biology",
    },
    {
      email: "manager@acm.com",
      password: "password123",
      name: "Test Manager",
      role: "MANAGER" as const,
      department: "Research Management",
    },
    {
      email: "admin@acm.com",
      password: "password123",
      name: "Test Admin",
      role: "ADMIN" as const,
      department: "IT Administration",
    },
  ];

  for (const userData of testUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`✓ User ${userData.email} already exists`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role,
        department: userData.department,
      },
    });

    console.log(`✓ Created user: ${user.email} (${user.role})`);
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
