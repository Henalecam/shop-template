"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type Tenant = { id: string; name: string };
type Product = { id: string; name: string; price: string };

async function fetchTenants(): Promise<Tenant[]> {
  const res = await axios.get(`${API_URL}/admin/tenants`);
  return res.data as Tenant[];
}

async function fetchProducts(tenantId: string): Promise<Product[]> {
  const res = await axios.get(`${API_URL}/admin/tenants/${tenantId}/products`);
  return res.data as Product[];
}

export default function ProductsPage() {
  const { data: tenants = [], isLoading: loadingTenants } = useQuery({ queryKey: ["tenants"], queryFn: fetchTenants });
  const [tenantId, setTenantId] = useState<string>("");

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products", tenantId],
    queryFn: () => fetchProducts(tenantId),
    enabled: !!tenantId,
  });

  const selectedTenantName = useMemo(() => tenants.find((t) => t.id === tenantId)?.name ?? "", [tenants, tenantId]);

  return (
    <div>
      <h1>Produtos</h1>
      <div style={{ margin: "12px 0" }}>
        <label>
          Tenant:
          <select
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            style={{ marginLeft: 8, padding: 4 }}
          >
            <option value="" disabled>
              {loadingTenants ? "Carregando tenants..." : "Selecione"}
            </option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {tenantId && (
        <div>
          <h2>Lista de produtos — {selectedTenantName}</h2>
          {loadingProducts && <p>Carregando...</p>}
          <ul>
            {products.map((p) => (
              <li key={p.id}>
                {p.name} — R$ {p.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}