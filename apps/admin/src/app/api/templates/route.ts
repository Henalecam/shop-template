import { mockTemplates } from '@/lib/mockData';

export async function GET() {
  const upstream = process.env.UPSTREAM_API_URL || 'http://localhost:4000/api';
  const base = upstream.replace(/\/$/, '');
  try {
    const res = await fetch(`${base}/templates`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    const payload: any = await res.json();
    const list: any[] = payload?.templates ?? payload ?? [];
    const data = list.map((t) => ({
      id: t.id,
      name: t.name,
      description: undefined,
      category: undefined,
      status: 'active',
      createdAt: t.created_at ?? null,
      updatedAt: null,
      previewUrl: t.preview_url_filled || t.preview_url || undefined,
      slug: t.slug || undefined,
    }));
    return Response.json(data);
  } catch {
    return Response.json(mockTemplates);
  }
}