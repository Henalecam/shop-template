import { Router } from "express";
import { prisma } from "../prisma.js";

const admin = Router();

// Tenants CRUD
admin.get("/tenants", async (req, res, next) => {
  try {
    const tenants = await prisma.tenant.findMany({ orderBy: { created_at: "desc" }, include: { template: true } });
    res.json(tenants);
  } catch (err) {
    next(err);
  }
});

admin.post("/tenants", async (req, res, next) => {
  try {
    const { name, logo_url, primary_color, secondary_color, pix_key, template_id } = req.body;
    const created = await prisma.tenant.create({
      data: { name, logo_url, primary_color, secondary_color, pix_key, template_id },
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

admin.put("/tenants/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, logo_url, primary_color, secondary_color, pix_key, template_id } = req.body;
    const updated = await prisma.tenant.update({
      where: { id },
      data: { name, logo_url, primary_color, secondary_color, pix_key, template_id },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

admin.delete("/tenants/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.deleteMany({ where: { tenant_id: id } });
    await prisma.tenant.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Products CRUD (scoped by tenant_id)
admin.get("/tenants/:tenantId/products", async (req, res, next) => {
  try {
    const { tenantId } = req.params;
    const products = await prisma.product.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_at: "desc" },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

admin.post("/tenants/:tenantId/products", async (req, res, next) => {
  try {
    const { tenantId } = req.params;
    const { name, description, price, image_url } = req.body;
    const created = await prisma.product.create({
      data: { tenant_id: tenantId, name, description, price, image_url },
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

admin.put("/tenants/:tenantId/products/:id", async (req, res, next) => {
  try {
    const { tenantId, id } = req.params;
    const { name, description, price, image_url } = req.body;
    const updated = await prisma.product.update({
      where: { id },
      data: { tenant_id: tenantId, name, description, price, image_url },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

admin.delete("/tenants/:tenantId/products/:id", async (req, res, next) => {
  try {
    const { tenantId, id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Templates CRUD (basic)
admin.get("/templates", async (req, res, next) => {
  try {
    const templates = await prisma.template.findMany({ orderBy: { created_at: "desc" } });
    res.json(templates);
  } catch (err) {
    next(err);
  }
});

admin.post("/templates", async (req, res, next) => {
  try {
    const { name, slug, preview_url } = req.body;
    const created = await prisma.template.create({ data: { name, slug, preview_url } });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

admin.put("/templates/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, preview_url } = req.body;
    const updated = await prisma.template.update({ where: { id }, data: { name, slug, preview_url } });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

admin.delete("/templates/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.template.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default admin;