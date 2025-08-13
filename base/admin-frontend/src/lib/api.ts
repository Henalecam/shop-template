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

export const api = {
  // Templates (admin)
  async listTemplates(): Promise<Template[]> {
    const { data } = await axios.get(`${API_URL}/admin/templates`);
    return data;
  },

  // Tenants
  async listTenants(): Promise<Tenant[]> {
    const { data } = await axios.get(`${API_URL}/admin/tenants`);
    return data;
  },
  async createTenant(payload: Partial<Tenant>): Promise<Tenant> {
    const { data } = await axios.post(`${API_URL}/admin/tenants`, payload);
    return data;
  },
  async updateTenant(id: string, payload: Partial<Tenant>): Promise<Tenant> {
    const { data } = await axios.put(`${API_URL}/admin/tenants/${id}`, payload);
    return data;
  },
  async deleteTenant(id: string): Promise<{ ok: true }> {
    const { data } = await axios.delete(`${API_URL}/admin/tenants/${id}`);
    return data;
  },

  // Products (scoped by tenant)
  async listProducts(tenantId: string): Promise<Product[]> {
    const { data } = await axios.get(`${API_URL}/admin/tenants/${tenantId}/products`);
    return data;
  },
  async createProduct(tenantId: string, payload: Partial<Product>): Promise<Product> {
    const { data } = await axios.post(`${API_URL}/admin/tenants/${tenantId}/products`, payload);
    return data;
  },
  async updateProduct(tenantId: string, id: string, payload: Partial<Product>): Promise<Product> {
    const { data } = await axios.put(`${API_URL}/admin/tenants/${tenantId}/products/${id}`, payload);
    return data;
  },
  async deleteProduct(tenantId: string, id: string): Promise<{ ok: true }> {
    const { data } = await axios.delete(`${API_URL}/admin/tenants/${tenantId}/products/${id}`);
    return data;
  },
};