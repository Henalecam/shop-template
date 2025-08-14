import { mockTenants } from '@/lib/mockData';

export async function GET() {
  const upstream = process.env.UPSTREAM_API_URL || 'http://localhost:4000/api';
  const base = upstream.replace(/\/$/, '');
  try {
    const res = await fetch(`${base}/admin/tenants`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Upstream failed: ${res.status}`);
    const tenants: any[] = await res.json();

    const counts = await Promise.all(
      tenants.map(async (t) => {
        try {
          const r = await fetch(`${base}/admin/tenants/${t.id}/products`, { cache: 'no-store' });
          if (!r.ok) return 0;
          const arr: any[] = await r.json();
          return Array.isArray(arr) ? arr.length : 0;
        } catch {
          return 0;
        }
      })
    );

    const data = tenants.map((t, idx) => ({
      id: t.id,
      name: t.name,
      domain: `${t.name}.example.com`,
      plan: 'pro',
      status: 'active',
      createdAt: t.created_at ?? null,
      usersCount: 0,
      productsCount: counts[idx] ?? 0,
    }));

    return Response.json(data);
  } catch {
    return Response.json(mockTenants);
  }
}