import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/products", async (req, res, next) => {
  try {
    const { store_name } = req.query;
    const where = store_name ? { store_name } : {};
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { created_at: "desc" },
    });
    
    return res.json({ products });
  } catch (err) {
    next(err);
  }
});

router.post("/products", async (req, res, next) => {
  try {
    const { name, description, price, image_url, store_name } = req.body;
    
    if (!name || !price || !store_name) {
      return res.status(400).json({ error: "Nome, preço e nome da loja são obrigatórios" });
    }
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image_url,
        store_name,
      },
    });
    
    return res.json({ product });
  } catch (err) {
    next(err);
  }
});

router.put("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, store_name } = req.body;
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        image_url,
        store_name,
      },
    });
    
    return res.json({ product });
  } catch (err) {
    next(err);
  }
});

router.delete("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: { id },
    });
    
    return res.json({ message: "Produto removido com sucesso" });
  } catch (err) {
    next(err);
  }
});

export default router;