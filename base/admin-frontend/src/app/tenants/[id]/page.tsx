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
    <div>
      <h1>Tenant: {tenant?.name || tenantId}</h1>
      {tenant?.template?.name && <p>Template atual: {tenant.template.name}</p>}
      <p style={{ marginBottom: 12 }}>
        <Link href={previewUrl} target="_blank">Abrir loja (preview)</Link>
      </p>

      {isLoading && <p>Carregando...</p>}
      {error && <p>Erro ao carregar</p>}
      <ul>
        {(products ?? []).map((p) => (
          <li key={p.id}>
            {p.name} — R$ {p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}