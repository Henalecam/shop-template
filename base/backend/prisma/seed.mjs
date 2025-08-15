import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const stores = [
    "Skate Shop",
    "Sneakers Store", 
    "Street Wear",
    "Minimal",
    "Electronics",
    "Home & Decor"
  ];

  const sampleProducts = [
    {
      name: "Shape Maple 8.0",
      description: "Shape 7 camadas de maple canadense",
      price: 349.90,
      image_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop",
      store_name: "Skate Shop"
    },
    {
      name: "Roda 52mm",
      description: "Dureza 99A, jogo com 4",
      price: 129.90,
      image_url: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=1200&auto=format&fit=crop",
      store_name: "Skate Shop"
    },
    {
      name: "Tênis Runner X",
      description: "Amortecimento responsivo",
      price: 399.90,
      image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      store_name: "Sneakers Store"
    },
    {
      name: "Tênis Street Pro",
      description: "Solado vulcanizado",
      price: 299.90,
      image_url: "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=1200&auto=format&fit=crop",
      store_name: "Sneakers Store"
    },
    {
      name: "Camiseta Oversized",
      description: "Malha 230gsm",
      price: 119.90,
      image_url: "https://images.unsplash.com/photo-1520975922284-9d26d111fadd?q=80&w=1200&auto=format&fit=crop",
      store_name: "Street Wear"
    },
    {
      name: "Calça Cargo",
      description: "Vários bolsos funcionais",
      price: 199.90,
      image_url: "https://images.unsplash.com/photo-1596755094514-f87e3e7fa8cf?q=80&w=1200&auto=format&fit=crop",
      store_name: "Street Wear"
    },
    {
      name: "Camiseta Básica",
      description: "Camiseta 100% algodão",
      price: 49.90,
      image_url: "https://images.unsplash.com/photo-1520975922284-9d26d111fadd?q=80&w=1200&auto=format&fit=crop",
      store_name: "Minimal"
    },
    {
      name: "Tênis Conforto",
      description: "Ideal para o dia a dia",
      price: 199.90,
      image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      store_name: "Minimal"
    },
    {
      name: "Smartphone ZX10",
      description: "128GB, Câmera 50MP",
      price: 2599.90,
      image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
      store_name: "Electronics"
    },
    {
      name: "Fone Bluetooth ANC",
      description: "Cancelamento ativo de ruído",
      price: 699.90,
      image_url: "https://images.unsplash.com/photo-1518443892832-96f1c7a83367?q=80&w=1200&auto=format&fit=crop",
      store_name: "Electronics"
    },
    {
      name: "Vaso Cerâmico",
      description: "Feito à mão",
      price: 89.90,
      image_url: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1200&auto=format&fit=crop",
      store_name: "Home & Decor"
    },
    {
      name: "Quadro Minimalista",
      description: "50x70cm",
      price: 159.90,
      image_url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop",
      store_name: "Home & Decor"
    }
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { 
        name_store_name: { 
          name: product.name, 
          store_name: product.store_name 
        } 
      },
      update: {},
      create: product,
    });
  }

  console.log("Seed completed! Created", sampleProducts.length, "sample products across", stores.length, "stores");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });