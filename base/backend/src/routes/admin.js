import { Router } from "express";
import { prisma } from "../prisma.js";

const admin = Router();

admin.get("/products", async (req, res, next) => {
  try {
    const { store_name } = req.query;
    const where = store_name ? { store_name } : {};
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { created_at: "desc" },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

admin.post("/products", async (req, res, next) => {
  try {
    const { name, description, price, image_url, store_name } = req.body;
    
    if (!name || !price || !store_name) {
      return res.status(400).json({ error: "Nome, preço e nome da loja são obrigatórios" });
    }
    
    const created = await prisma.product.create({
      data: { name, description, price: parseFloat(price), image_url, store_name },
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

admin.put("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, store_name } = req.body;
    
    const updated = await prisma.product.update({
      where: { id },
      data: { name, description, price: parseFloat(price), image_url, store_name },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

admin.delete("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default admin;