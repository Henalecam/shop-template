"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "../../lib/api";

const FRONTEND_BASE = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "";

type Template = { id: string; name: string; slug: string; preview_url: string };

type Tenant = { id: string; name: string };

export default function TemplatesPage() {
  const { data: templatesData, isLoading, error } = useQuery({ queryKey: ["templates"], queryFn: api.listTemplates });
  const { data: tenantsData } = useQuery({ queryKey: ["tenants"], queryFn: api.listTenants });
  const templates = useMemo<Template[]>(() => templatesData ?? [], [templatesData]);
  const tenants = useMemo<Tenant[]>(() => (tenantsData ?? []).map((t: any) => ({ id: t.id, name: t.name })), [tenantsData]);

  const [tenantIdPreview, setTenantIdPreview] = useState("");

  useEffect(() => {
    if (!tenantIdPreview && tenants.length > 0) setTenantIdPreview(tenants[0].id);
  }, [tenants, tenantIdPreview]);

  return (
    <div className="vstack">
      <h1>Templates</h1>

      <div className="card section vstack">
        <div className="grid two">
          <div>
            <label>Tenant ID para preview</label>
            <input className="input" placeholder="cole o tenantId" value={tenantIdPreview} onChange={(e) => setTenantIdPreview(e.target.value)} />
          </div>
          <div className="vstack">
            <label>Ajuda</label>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Os templates são e-commerces de nichos diferentes. O preview usa os produtos do tenant selecionado.</div>
          </div>
        </div>
      </div>

      <div className="cards">
        {isLoading && <div className="card section">Carregando...</div>}
        {error && <div className="card section" style={{ color: "#fca5a5" }}>Erro ao carregar</div>}
        {templates.map((t) => {
          let href = t.preview_url;
          if (FRONTEND_BASE && tenantIdPreview) href = `${FRONTEND_BASE}/templates/${t.slug}?tenantId=${tenantIdPreview}`;
          else if (tenantIdPreview) href = t.preview_url.replace("{tenantId}", tenantIdPreview);
          return (
            <div key={t.id} className="card section vstack">
              <div className="hstack" style={{ justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div className="badge gray">slug: {t.slug}</div>
                </div>
                <Link href={href} target="_blank" className="btn primary">Abrir preview</Link>
              </div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                E-commerce pronto para nicho "{t.slug}" usando os produtos do tenant selecionado.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}