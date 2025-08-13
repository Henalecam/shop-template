"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function fetchTenants() {
  const res = await axios.get(`${API_URL}/admin/tenants`);
  return res.data as Array<{ id: string; name: string; template?: { name: string } | null }>;
}

export default function HomePage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["tenants"], queryFn: fetchTenants });

  const tenants = useMemo(() => data ?? [], [data]);

  return (
    <div>
      <h1>Admin</h1>

      <section style={{ marginTop: 16 }}>
        <h2>Tenants</h2>
        {isLoading && <p>Carregando...</p>}
        {error && <p>Erro ao carregar</p>}
        <ul>
          {tenants.map((t) => (
            <li key={t.id}>
              <Link href={`/tenants/${t.id}`}>{t.name}</Link>
              {t.template?.name ? <span style={{ marginLeft: 8, color: "#888" }}>template: {t.template.name}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Templates</h2>
        <p>
          <Link href="/templates">Ver templates</Link>
        </p>
      </section>
    </div>
  );
}