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

// Sempre execute o seed de forma idempotente (usa upsert no script de seed)
const prisma = new PrismaClient();

async function alwaysSeed() {
  try {
    await prisma.$connect();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Database connection failed before seeding:", err);
  } finally {
    await prisma.$disconnect();
  }
  run("node", ["--import=dotenv/config", "prisma/seed.mjs"]);
}

await alwaysSeed();