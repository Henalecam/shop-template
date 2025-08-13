"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type Product = { id: string; name: string; price: string };

async function fetchTenant(tenantId: string) {
  const res = await axios.get(`${API_URL}/admin/tenants`);
  const all = res.data as Array<{ id: string; name: string; template?: { name: string } | null }>;
  return all.find((t) => t.id === tenantId) || null;
}

async function fetchProducts(tenantId: string) {
  const res = await axios.get(`${API_URL}/admin/tenants/${tenantId}/products`);
  return res.data as Array<Product>;
}

export default function TenantPage() {
  const params = useParams<{ id: string }>();
  const tenantId = params.id;

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", tenantId],
    queryFn: () => fetchProducts(tenantId),
    enabled: !!tenantId,
  });

  const { data: tenant } = useQuery({
    queryKey: ["tenant", tenantId],
    queryFn: () => fetchTenant(tenantId),
    enabled: !!tenantId,
  });

  const previewUrl = `/?tenantId=${tenantId}`;

  return (
    <div className="vstack">
      <div className="hstack" style={{ justifyContent: "space-between" }}>
        <div className="hstack" style={{ gap: 8 }}>
          <Link href="/tenants" className="btn ghost">Voltar</Link>
          <h1>Tenant: {tenant?.name || tenantId}</h1>
        </div>
        <div className="hstack" style={{ gap: 8 }}>
          {tenant?.template?.name && <span className="badge gray">Template: {tenant.template.name}</span>}
          <Link href={previewUrl} target="_blank" className="btn primary">Abrir loja (preview)</Link>
        </div>
      </div>

      <div className="card section">
        <h2>Produtos</h2>
        {isLoading && <div>Carregando...</div>}
        {error && <div style={{ color: "#fca5a5" }}>Erro ao carregar</div>}
        <ul>
          {(products ?? []).map((p) => (
            <li key={p.id} style={{ padding: 6, borderBottom: "1px solid var(--border)" }}>
              {p.name} — R$ {p.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}