import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function run(command, args) {
  console.log(`Running: ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    console.error(`Command failed with status ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

console.log("Database initialization starting...");

// First, try to generate the Prisma client
console.log("Generating Prisma client...");
try {
  run("npx", ["prisma", "generate"]);
  console.log("Prisma client generated successfully");
} catch (error) {
  console.error("Failed to generate Prisma client:", error);
  process.exit(1);
}

// Check if migrations directory exists
const migrationsDir = path.join(projectRoot, "prisma", "migrations");
const hasMigrations = fs.existsSync(migrationsDir) && fs.readdirSync(migrationsDir).length > 0;

console.log(`Migrations directory exists: ${fs.existsSync(migrationsDir)}`);
console.log(`Has migrations: ${hasMigrations}`);

// Try to push the schema or run migrations
try {
  if (hasMigrations) {
    console.log("Running migrations...");
    run("npx", ["prisma", "migrate", "deploy"]);
  } else {
    console.log("No migrations found, pushing schema...");
    run("npx", ["prisma", "db", "push"]);
  }
  console.log("Database schema updated successfully");
} catch (error) {
  console.error("Failed to update database schema:", error);
  process.exit(1);
}

// Run the seed script
console.log("Running seed script...");
try {
  run("node", ["--import=dotenv/config", "prisma/seed.mjs"]);
  console.log("Seed completed successfully");
} catch (error) {
  console.error("Failed to run seed:", error);
  // Don't exit here, as the application might still work without seed data
}

console.log("Database initialization completed successfully");