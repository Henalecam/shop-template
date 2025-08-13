import { mockTenants } from '@/lib/mockData';

export async function GET() {
  const upstream = process.env.UPSTREAM_API_URL;
  if (upstream) {
    const res = await fetch(`${upstream.replace(/\/$/, '')}/tenants`, { cache: 'no-store' });
    const data = await res.json();
    return Response.json(data);
  }
  return Response.json(mockTenants);
}