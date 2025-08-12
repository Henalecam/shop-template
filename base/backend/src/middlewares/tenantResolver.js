import { prisma } from "../prisma.js";

function extractSubdomain(hostname, primaryDomainEnv) {
  if (!hostname) return null;
  const host = hostname.toLowerCase();

  // If a primary domain is provided, strip it. Example: loja1.sistema.com -> [loja1]
  const primaryDomain = (primaryDomainEnv || "").toLowerCase().trim();
  if (primaryDomain && host.endsWith(primaryDomain)) {
    const withoutDomain = host.slice(0, -primaryDomain.length);
    const trimmed = withoutDomain.replace(/\.$/, "");
    if (!trimmed) return null;
    const parts = trimmed.split(".").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : null;
  }

  // Fallback: take first label before the first dot (skip localhost)
  const parts = host.split(".");
  if (parts.length <= 1 || parts[0] === "localhost") return null;
  return parts[0];
}

export async function tenantResolver(req, res, next) {
  try {
    const headerTenantId = req.header("x-tenant-id");
    let tenant = null;

    if (headerTenantId) {
      tenant = await prisma.tenant.findUnique({ where: { id: headerTenantId } });
    } else {
      const subdomain = extractSubdomain(req.hostname, process.env.PRIMARY_DOMAIN);
      if (subdomain) {
        tenant = await prisma.tenant.findUnique({ where: { name: subdomain } });
      }
    }

    if (!tenant) {
      return res.status(400).json({ error: "Tenant não encontrado. Informe x-tenant-id ou use subdomínio válido." });
    }

    res.locals.tenant = tenant;
    next();
  } catch (err) {
    next(err);
  }
}