"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const FRONTEND_BASE = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "";

type Template = { id: string; name: string; slug: string; preview_url: string };

async function fetchTemplates() {
  const res = await axios.get(`${API_URL}/admin/templates`);
  return res.data as Template[];
}

export default function TemplatesPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["templates"], queryFn: fetchTemplates });
  const templates = useMemo(() => data ?? [], [data]);
  const [tenantIdPreview, setTenantIdPreview] = useState("");

  return (
    <div>
      <h1>Templates</h1>
      <div style={{ marginBottom: 12 }}>
        <label>
          Tenant ID para preview:
          <input
            value={tenantIdPreview}
            onChange={(e) => setTenantIdPreview(e.target.value)}
            placeholder="cole o tenantId aqui"
            style={{ marginLeft: 8, padding: 4, border: "1px solid #ccc" }}
          />
        </label>
      </div>

      {isLoading && <p>Carregando...</p>}
      {error && <p>Erro ao carregar</p>}

      <ul>
        {templates.map((t) => {
          let href = t.preview_url;
          if (FRONTEND_BASE && tenantIdPreview) href = `${FRONTEND_BASE}/templates/${t.slug}?tenantId=${tenantIdPreview}`;
          else if (tenantIdPreview) href = t.preview_url.replace("{tenantId}", tenantIdPreview);
          return (
            <li key={t.id} style={{ marginBottom: 8 }}>
              <strong>{t.name}</strong> — slug: {t.slug} — {" "}
              <Link href={href} target="_blank">
                abrir preview
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}