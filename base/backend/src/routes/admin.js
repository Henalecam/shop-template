import { Router } from "express";
import { prisma } from "../prisma.js";

const admin = Router();

// Função para converter Decimal para número
const convertDecimalToNumber = (data) => {
  if (data && typeof data === 'object') {
    const converted = { ...data };
    if (converted.price && typeof converted.price === 'object' && converted.price.toNumber) {
      converted.price = converted.price.toNumber();
    }
    return converted;
  }
  return data;
};

admin.get("/products", async (req, res, next) => {
  try {
    const { store_name } = req.query;
    const productsKey = process.env.Products_Key;
    
    let where = store_name ? { store_name } : {};
    
    // Se a variável de ambiente Products_Key estiver definida, filtrar por ela
    if (productsKey) {
      where = { ...where, key: productsKey };
    }
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { created_at: "desc" },
    });
    
    // Converter todos os produtos para ter price como número
    const convertedProducts = products.map(convertDecimalToNumber);
    res.json(convertedProducts);
  } catch (err) {
    next(err);
  }
});

admin.post("/products", async (req, res, next) => {
  try {
    const { name, description, price, image_url, store_name, key } = req.body;
    
    if (!name || !price || !store_name) {
      return res.status(400).json({ error: "Nome, preço e nome da loja são obrigatórios" });
    }
    
    // Validar se o preço é um número válido
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: "Preço deve ser um número válido maior ou igual a zero" });
    }
    
    const created = await prisma.product.create({
      data: { name, description, price: numericPrice, image_url, store_name, key },
    });
    
    const convertedProduct = convertDecimalToNumber(created);
    res.status(201).json(convertedProduct);
  } catch (err) {
    next(err);
  }
});

admin.put("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, store_name, key } = req.body;
    
    // Validar se o preço é um número válido (se fornecido)
    let numericPrice;
    if (price !== undefined) {
      numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ error: "Preço deve ser um número válido maior ou igual a zero" });
      }
    }
    
    const updateData = { name, description, image_url, store_name, key };
    if (numericPrice !== undefined) {
      updateData.price = numericPrice;
    }
    
    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    
    const convertedProduct = convertDecimalToNumber(updated);
    res.json(convertedProduct);
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