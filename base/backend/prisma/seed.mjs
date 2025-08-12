import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { name: "loja1" },
    update: {},
    create: {
      name: "loja1",
      logo_url: null,
      primary_color: "#111827",
      secondary_color: "#6366f1",
      pix_key: "chave-pix-de-teste@example.com",
    },
  });

  const productsData = [
    {
      name: "Camiseta Básica",
      description: "Camiseta 100% algodão",
      price: "49.90",
      image_url: "https://images.unsplash.com/photo-1520975922284-9d26d111fadd?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Tênis Conforto",
      description: "Ideal para o dia a dia",
      price: "199.90",
      image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Mochila Urbana",
      description: "Resistente e leve",
      price: "129.90",
      image_url: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { name_tenant_id: { name: p.name, tenant_id: tenant.id } },
      update: {},
      create: { ...p, tenant_id: tenant.id },
    });
  }

  console.log("Seed completed for tenant:", tenant.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });