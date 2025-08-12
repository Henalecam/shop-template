import { Router } from "express";
import { prisma } from "../prisma.js";
import { tenantResolver } from "../middlewares/tenantResolver.js";
import { geoMessage } from "../middlewares/geoMessage.js";
import pkg from "qrcode-pix";

const { QrCodePix } = pkg;

const router = Router();

router.get("/tenant", tenantResolver, geoMessage, async (req, res, next) => {
  try {
    const tenant = res.locals.tenant;
    const geo = res.locals.geo;
    return res.json({
      tenant,
      delivery_message: geo?.deliveryMessage || null,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/products", tenantResolver, geoMessage, async (req, res, next) => {
  try {
    const tenant = res.locals.tenant;
    const products = await prisma.product.findMany({
      where: { tenant_id: tenant.id },
      orderBy: { created_at: "desc" },
    });
    const geo = res.locals.geo;
    return res.json({
      products,
      delivery_message: geo?.deliveryMessage || null,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/payment/pix/:productId", tenantResolver, async (req, res, next) => {
  try {
    const tenant = res.locals.tenant;
    const { productId } = req.params;

    const product = await prisma.product.findFirst({
      where: { id: productId, tenant_id: tenant.id },
    });

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    if (!tenant.pix_key) {
      return res.status(400).json({ error: "Tenant não possui chave PIX configurada" });
    }

    const value = Number(product.price);
    const pix = QrCodePix({
      version: "01",
      key: tenant.pix_key,
      name: tenant.name.substring(0, 25),
      city: "SAO PAULO",
      message: product.name.substring(0, 25),
      value: value,
      isUnique: true,
    });

    const payload = await pix.payload();
    const qrCodeDataUrl = await pix.base64();

    return res.json({
      product: { id: product.id, name: product.name, price: product.price },
      pix: { payload },
      qrcode: { data_url: qrCodeDataUrl },
    });
  } catch (err) {
    next(err);
  }
});

export default router;