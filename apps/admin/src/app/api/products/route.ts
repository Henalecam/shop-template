import { mockProducts } from '@/lib/mockData';

export async function GET(request: Request) {
  const upstream = process.env.UPSTREAM_API_URL || 'http://localhost:4000/api';
  const base = upstream.replace(/\/$/, '');
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  try {
    if (tenantId) {
      const res = await fetch(`${base}/admin/tenants/${tenantId}/products`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed');
      const items: any[] = await res.json();
      const data = items.map((p) => ({
        id: p.id,
        name: p.name,
        sku: undefined,
        price: Number(p.price),
        currency: 'BRL',
        status: 'active',
        createdAt: p.created_at,
        tags: [],
        templateId: undefined,
      }));
      return Response.json(data);
    }
    // aggregate from all tenants
    const tenantsRes = await fetch(`${base}/admin/tenants`, { cache: 'no-store' });
    if (!tenantsRes.ok) throw new Error('Failed tenants');
    const tenants: any[] = await tenantsRes.json();

    const all: any[] = [];
    for (const t of tenants) {
      try {
        const r = await fetch(`${base}/admin/tenants/${t.id}/products`, { cache: 'no-store' });
        if (!r.ok) continue;
        const list: any[] = await r.json();
        for (const p of list) all.push({ ...p, tenant_id: t.id });
      } catch {}
    }

    const data = all.map((p) => ({
      id: p.id,
      name: p.name,
      sku: undefined,
      price: Number(p.price),
      currency: 'BRL',
      status: 'active',
      createdAt: p.created_at,
      tags: [],
      templateId: undefined,
    }));
    return Response.json(data);
  } catch {
    return Response.json(mockProducts);
  }
}