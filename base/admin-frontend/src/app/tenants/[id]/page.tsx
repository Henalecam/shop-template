"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function fetchProducts(tenantId: string) {
  const res = await axios.get(`${API_URL}/admin/tenants/${tenantId}/products`);
  return res.data as Array<{ id: string; name: string; price: string }>;
}

export default function TenantPage() {
  const params = useParams<{ id: string }>();
  const tenantId = params.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", tenantId],
    queryFn: () => fetchProducts(tenantId),
    enabled: !!tenantId,
  });

  return (
    <div>
      <h1>Tenant: {tenantId}</h1>
      {isLoading && <p>Carregando...</p>}
      {error && <p>Erro ao carregar</p>}
      <ul>
        {(data ?? []).map((p) => (
          <li key={p.id}>
            {p.name} — R$ {p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}