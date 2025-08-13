import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Templates
  const templates = [
    { name: "Skate Shop", slug: "skate", preview_url: "/templates/skate?tenantId={tenantId}" },
    { name: "Sneakers Store", slug: "sneakers", preview_url: "/templates/sneakers?tenantId={tenantId}" },
    { name: "Street Wear", slug: "streetwear", preview_url: "/templates/streetwear?tenantId={tenantId}" },
    { name: "Minimal", slug: "minimal", preview_url: "/templates/minimal?tenantId={tenantId}" },
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

  // Tenants
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

  const loja1 = await prisma.tenant.upsert({
    where: { name: "loja1" },
    update: {},
    create: {
      name: "loja1",
      logo_url: null,
      primary_color: "#111827",
      secondary_color: "#6366f1",
      pix_key: "chave-pix-de-teste@example.com",
      template_id: templateMap["minimal"],
    },
  });

  // Products per tenant (scoped)
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
    [loja1.id]: [
      {
        name: "Camiseta Básica",
        description: "Camiseta 100% algodão",
        price: "49.90",
        image_url:
          "https://images.unsplash.com/photo-1520975922284-9d26d111fadd?q=80&w=1200&auto=format&fit=crop",
      },
      {
        name: "Tênis Conforto",
        description: "Ideal para o dia a dia",
        price: "199.90",
        image_url:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      },
      {
        name: "Mochila Urbana",
        description: "Resistente e leve",
        price: "129.90",
        image_url:
          "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1200&auto=format&fit=crop",
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

  console.log("Seed completed for tenants:", { skate: skateTenant.name, loja1: loja1.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });