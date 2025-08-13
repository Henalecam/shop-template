import { Template, Product, Tenant } from '@/types';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  templates: () => getJson<Template[]>('/api/templates'),
  products: () => getJson<Product[]>('/api/products'),
  tenants: () => getJson<Tenant[]>('/api/tenants'),
};