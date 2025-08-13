import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Templates (5)
  const templates = [
    { name: "Skate Shop", slug: "skate", preview_url: "/templates/skate?tenantId={tenantId}" },
    { name: "Sneakers Store", slug: "sneakers", preview_url: "/templates/sneakers?tenantId={tenantId}" },
    { name: "Street Wear", slug: "streetwear", preview_url: "/templates/streetwear?tenantId={tenantId}" },
    { name: "Minimal", slug: "minimal", preview_url: "/templates/minimal?tenantId={tenantId}" },
    { name: "Electronics", slug: "electronics", preview_url: "/templates/electronics?tenantId={tenantId}" },
  ];

  const templateMap = {};
  for (const t of templates) {
    const created = await prisma.template.upsert({
      where: { slug: t.slug },
      update: { name: t.name, preview_url: t.preview_url },
      create: t,
    });
    templateMap[t.slug] = created.id;
  }

  // Tenants (5)
  const skateTenant = await prisma.tenant.upsert({
    where: { name: "skate" },
    update: {},
    create: {
      name: "skate",
      primary_color: "#0ea5e9",
      secondary_color: "#111827",
      pix_key: "skate@example.com",
      template_id: templateMap["skate"],
    },
  });

  const sneakersTenant = await prisma.tenant.upsert({
    where: { name: "sneakers" },
    update: {},
    create: {
      name: "sneakers",
      primary_color: "#111827",
      secondary_color: "#22d3ee",
      pix_key: "sneakers@example.com",
      template_id: templateMap["sneakers"],
    },
  });

  const streetwearTenant = await prisma.tenant.upsert({
    where: { name: "streetwear" },
    update: {},
    create: {
      name: "streetwear",
      primary_color: "#1f2937",
      secondary_color: "#f59e0b",
      pix_key: "streetwear@example.com",
      template_id: templateMap["streetwear"],
    },
  });

  const minimalTenant = await prisma.tenant.upsert({
    where: { name: "minimal" },
    update: {},
    create: {
      name: "minimal",
      primary_color: "#111827",
      secondary_color: "#6366f1",
      pix_key: "minimal@example.com",
      template_id: templateMap["minimal"],
    },
  });

  const electronicsTenant = await prisma.tenant.upsert({
    where: { name: "electronics" },
    update: {},
    create: {
      name: "electronics",
      primary_color: "#0f172a",
      secondary_color: "#38bdf8",
      pix_key: "electronics@example.com",
      template_id: templateMap["electronics"],
    },
  });

  // Products per tenant
  const productsByTenant = {
    [skateTenant.id]: [
      {
        name: "Shape Maple 8.0",
        description: "Shape 7 camadas de maple canadense",
        price: "349.90",
        image_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop",
      },
      {
        name: "Roda 52mm",
        description: "Dureza 99A, jogo com 4",
        price: "129.90",
        image_url: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=1200&auto=format&fit=crop",
      },
      {
        name: "Truck Low 139mm",
        description: "Par de trucks leves",
        price: "279.90",
        image_url: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    [sneakersTenant.id]: [
      {
        name: "Tênis Runner X",
        description: "Amortecimento responsivo",
        price: "399.90",
        image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      },
      {
        name: "Tênis Street Pro",
        description: "Solado vulcanizado",
        price: "299.90",
        image_url: "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=1200&auto=format&fit=crop",
      },
      {
        name: "Meia Performance",
        description: "Par com suporte no arco",
        price: "39.90",
        image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    [streetwearTenant.id]: [
      {
        name: "Camiseta Oversized",
        description: "Malha 230gsm",
        price: "119.90",
        image_url: "https://images.unsplash.com/photo-1520975922284-9d26d111fadd?q=80&w=1200&auto=format&fit=crop",
      },
      {
        name: "Calça Cargo",
        description: "Vários bolsos funcionais",
        price: "199.90",
        image_url: "https://images.unsplash.com/photo-1596755094514-f87e3e7fa8cf?q=80&w=1200&auto=format&fit=crop",
      },
      {
        name: "Boné Trucker",
        description: "Ajustável, tela traseira",
        price: "79.90",
        image_url: "https://images.unsplash.com/photo-1520976191273-8b3a1c1d7c3d?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    [minimalTenant.id]: [
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
    ],
    [electronicsTenant.id]: [
      {
        name: "Smartphone ZX10",
        description: "128GB, Câmera 50MP",
        price: "2599.90",
        image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
      },
      {
        name: "Fone Bluetooth ANC",
        description: "Cancelamento ativo de ruído",
        price: "699.90",
        image_url: "https://images.unsplash.com/photo-1518443892832-96f1c7a83367?q=80&w=1200&auto=format&fit=crop",
      },
      {
        name: "Notebook Slim 14",
        description: "i5, 16GB, SSD 512GB",
        price: "4599.90",
        image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
      },
    ],
  };

  for (const [tenantId, products] of Object.entries(productsByTenant)) {
    for (const p of products) {
      await prisma.product.upsert({
        where: { name_tenant_id: { name: p.name, tenant_id: tenantId } },
        update: {},
        create: { ...p, tenant_id: tenantId },
      });
    }
  }

  console.log("Seed completed for tenants:", {
    skate: skateTenant.name,
    sneakers: sneakersTenant.name,
    streetwear: streetwearTenant.name,
    minimal: minimalTenant.name,
    electronics: electronicsTenant.name,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });