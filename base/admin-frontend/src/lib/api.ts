import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Types kept inline to avoid circular deps
export type Template = { id: string; name: string; slug: string; preview_url: string };
export type Tenant = {
  id: string;
  name: string;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  pix_key?: string | null;
  template_id?: string | null;
  template?: { id: string; name: string } | null;
  created_at?: string;
};
export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  image_url?: string | null;
  tenant_id?: string;
  created_at?: string;
};

// Fallback samples to ensure default data visibility
const FALLBACK_TEMPLATES: Template[] = [
  { id: "t-minimal", name: "Minimal", slug: "minimal", preview_url: "/templates/minimal" },
  { id: "t-skate", name: "Skate Shop", slug: "skate", preview_url: "/templates/skate" },
  { id: "t-sneakers", name: "Sneakers Store", slug: "sneakers", preview_url: "/templates/sneakers" },
  { id: "t-streetwear", name: "Street Wear", slug: "streetwear", preview_url: "/templates/streetwear" },
  { id: "t-electronics", name: "Electronics", slug: "electronics", preview_url: "/templates/electronics" },
];

const FALLBACK_TENANTS: Tenant[] = [
  { id: "tenant-minimal", name: "minimal", primary_color: "#111827", secondary_color: "#6366f1", template: { id: "t-minimal", name: "Minimal" } },
  { id: "tenant-skate", name: "skate", primary_color: "#0ea5e9", secondary_color: "#111827", template: { id: "t-skate", name: "Skate Shop" } },
  { id: "tenant-sneakers", name: "sneakers", primary_color: "#111827", secondary_color: "#22d3ee", template: { id: "t-sneakers", name: "Sneakers Store" } },
  { id: "tenant-streetwear", name: "streetwear", primary_color: "#1f2937", secondary_color: "#f59e0b", template: { id: "t-streetwear", name: "Street Wear" } },
  { id: "tenant-electronics", name: "electronics", primary_color: "#0f172a", secondary_color: "#38bdf8", template: { id: "t-electronics", name: "Electronics" } },
];

const FALLBACK_PRODUCTS: Product[] = [
  { id: "p1", name: "Camiseta Básica", description: "Camiseta 100% algodão", price: "49.90", image_url: "https://images.unsplash.com/photo-1520975922284-9d26d111fadd?q=80&w=1200&auto=format&fit=crop" },
  { id: "p2", name: "Tênis Conforto", description: "Ideal para o dia a dia", price: "199.90", image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop" },
  { id: "p3", name: "Mochila Urbana", description: "Resistente e leve", price: "129.90", image_url: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1200&auto=format&fit=crop" },
];

export const api = {
  // Templates (admin)
  async listTemplates(): Promise<Template[]> {
    try {
      const { data } = await axios.get(`${API_URL}/admin/templates`);
      if (Array.isArray(data) && data.length > 0) return data;
      return FALLBACK_TEMPLATES;
    } catch {
      return FALLBACK_TEMPLATES;
    }
  },

  // Tenants
  async listTenants(): Promise<Tenant[]> {
    try {
      const { data } = await axios.get(`${API_URL}/admin/tenants`);
      if (Array.isArray(data) && data.length > 0) return data;
      return FALLBACK_TENANTS;
    } catch {
      return FALLBACK_TENANTS;
    }
  },
  async createTenant(payload: Partial<Tenant>): Promise<Tenant> {
    try {
      const { data } = await axios.post(`${API_URL}/admin/tenants`, payload);
      return data;
    } catch {
      // simulate local create in fallback mode
      const mock: Tenant = { id: `t-${Date.now()}`, name: payload.name || "novo-tenant", ...payload } as Tenant;
      return mock;
    }
  },
  async updateTenant(id: string, payload: Partial<Tenant>): Promise<Tenant> {
    try {
      const { data } = await axios.put(`${API_URL}/admin/tenants/${id}`, payload);
      return data;
    } catch {
      // in fallback, just echo back
      return { id, name: payload.name || "tenant", ...payload } as Tenant;
    }
  },
  async deleteTenant(id: string): Promise<{ ok: true }> {
    try {
      const { data } = await axios.delete(`${API_URL}/admin/tenants/${id}`);
      return data;
    } catch {
      return { ok: true } as any;
    }
  },

  // Products (scoped by tenant)
  async listProducts(tenantId: string): Promise<Product[]> {
    try {
      const { data } = await axios.get(`${API_URL}/admin/tenants/${tenantId}/products`);
      if (Array.isArray(data) && data.length > 0) return data;
      return FALLBACK_PRODUCTS.map((p) => ({ ...p, tenant_id: tenantId }));
    } catch {
      return FALLBACK_PRODUCTS.map((p) => ({ ...p, tenant_id: tenantId }));
    }
  },
  async createProduct(tenantId: string, payload: Partial<Product>): Promise<Product> {
    try {
      const { data } = await axios.post(`${API_URL}/admin/tenants/${tenantId}/products`, payload);
      return data;
    } catch {
      const mock: Product = { id: `p-${Date.now()}`, name: payload.name || "produto", price: payload.price || "0.00", tenant_id: tenantId };
      return mock;
    }
  },
  async updateProduct(tenantId: string, id: string, payload: Partial<Product>): Promise<Product> {
    try {
      const { data } = await axios.put(`${API_URL}/admin/tenants/${tenantId}/products/${id}`, payload);
      return data;
    } catch {
      return { id, tenant_id: tenantId, name: payload.name || "produto", price: payload.price || "0.00", ...payload } as Product;
    }
  },
  async deleteProduct(tenantId: string, id: string): Promise<{ ok: true }> {
    try {
      const { data } = await axios.delete(`${API_URL}/admin/tenants/${tenantId}/products/${id}`);
      return data;
    } catch {
      return { ok: true } as any;
    }
  },
};