import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const migrationsDir = path.join(projectRoot, "prisma", "migrations");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const hasMigrations = fs.existsSync(migrationsDir) && fs.readdirSync(migrationsDir).length > 0;

if (hasMigrations) {
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  run("npx", ["prisma", "db", "push"]);
}

// Após aplicar o schema, garanta que haja dados mínimos via seed
const prisma = new PrismaClient();

async function seedIfEmpty() {
  try {
    await prisma.$connect();
    const [tenants, templates, products] = await Promise.all([
      prisma.tenant.count(),
      prisma.template.count(),
      prisma.product.count(),
    ]);

    const shouldSeed = tenants === 0 || templates === 0 || products === 0;
    if (shouldSeed) {
      run("node", ["--import=dotenv/config", "prisma/seed.mjs"]);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Seed check failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

await seedIfEmpty();