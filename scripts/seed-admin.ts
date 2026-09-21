import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../lib/db";

loadEnvConfig(process.cwd());

const seedAdminEnvSchema = z.object({
  SEED_ADMIN_EMAIL: z.string().trim().toLowerCase().email(),
  SEED_ADMIN_PASSWORD: z.string().min(1),
});

async function main() {
  const parsed = seedAdminEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(
      "Set SEED_ADMIN_EMAIL (valid email) and SEED_ADMIN_PASSWORD (non-empty) before running seed:admin.",
    );
    process.exit(1);
  }

  const email = parsed.data.SEED_ADMIN_EMAIL;
  const password = parsed.data.SEED_ADMIN_PASSWORD;

  const existing = await db.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists for ${email}; skipping create.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.admin.create({
    data: { email, passwordHash },
  });

  console.log(`Created admin ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
