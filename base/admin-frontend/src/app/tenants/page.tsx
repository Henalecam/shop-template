"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Modal from "../../components/Modal";
import { api, Tenant, Template } from "../../lib/api";

function TenantForm({ initial, templates, onSubmit }: {
  initial?: Partial<Tenant>;
  templates: Template[];
  onSubmit: (values: Partial<Tenant>) => void;
}) {
  const [values, setValues] = useState<Partial<Tenant>>({
    name: "",
    logo_url: "",
    primary_color: "",
    secondary_color: "",
    pix_key: "",
    template_id: "",
    ...initial,
  });
  return (
    <form className="vstack" onSubmit={(e) => { e.preventDefault(); onSubmit(values); }}>
      <div className="grid two">
        <div>
          <label>Nome</label>
          <input className="input" value={values.name || ""} onChange={(e) => setValues(v => ({ ...v, name: e.target.value }))} required />
        </div>
        <div>
          <label>Logo URL</label>
          <input className="input" value={values.logo_url || ""} onChange={(e) => setValues(v => ({ ...v, logo_url: e.target.value }))} />
        </div>
      </div>
      <div className="grid two">
        <div>
          <label>Cor primária</label>
          <input className="input" placeholder="#111827" value={values.primary_color || ""} onChange={(e) => setValues(v => ({ ...v, primary_color: e.target.value }))} />
        </div>
        <div>
          <label>Cor secundária</label>
          <input className="input" placeholder="#22d3ee" value={values.secondary_color || ""} onChange={(e) => setValues(v => ({ ...v, secondary_color: e.target.value }))} />
        </div>
      </div>
      <div className="grid two">
        <div>
          <label>PIX Key</label>
          <input className="input" value={values.pix_key || ""} onChange={(e) => setValues(v => ({ ...v, pix_key: e.target.value }))} />
        </div>
        <div>
          <label>Template</label>
          <select className="input" value={values.template_id || ""} onChange={(e) => setValues(v => ({ ...v, template_id: e.target.value || undefined }))}>
            <option value="">Sem template</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>
      <div className="hstack" style={{ justifyContent: "flex-end", gap: 8 }}>
        <button type="submit" className="btn primary">Salvar</button>
      </div>
    </form>
  );
}

export default function TenantsPage() {
  const qc = useQueryClient();
  const { data: tenants = [], isLoading, error } = useQuery({ queryKey: ["tenants"], queryFn: api.listTenants });
  const { data: templates = [] } = useQuery({ queryKey: ["templates"], queryFn: api.listTemplates });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Tenant>) => api.createTenant(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tenants"] }); setModalOpen(false); setEditing(null); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Tenant> }) => api.updateTenant(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tenants"] }); setModalOpen(false); setEditing(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteTenant(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenants"] }),
  });

  const rows = useMemo(() => tenants, [tenants]);

  return (
    <div className="vstack">
      <div className="hstack" style={{ justifyContent: "space-between" }}>
        <h1>Tenants</h1>
        <button className="btn primary" onClick={() => { setEditing(null); setModalOpen(true); }}>Novo tenant</button>
      </div>

      <div className="card section">
        {isLoading && <div>Carregando...</div>}
        {error && <div style={{ color: "#fca5a5" }}>Erro ao carregar</div>}
        {!isLoading && rows.length === 0 && <div style={{ color: "var(--muted)" }}>Nenhum tenant cadastrado.</div>}
        {rows.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Template</th>
                <th style={{ width: 200 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.template?.name || <span className="badge gray">sem template</span>}</td>
                  <td className="hstack" style={{ gap: 8 }}>
                    <a className="btn ghost" href={`/tenants/${t.id}`}>Ver</a>
                    <button className="btn ghost" onClick={() => { setEditing(t); setModalOpen(true); }}>Editar</button>
                    <button className="btn danger" onClick={() => { if (confirm("Excluir tenant? Esta ação é irreversível.")) deleteMutation.mutate(t.id); }}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar tenant" : "Novo tenant"}>
        <TenantForm
          initial={editing || undefined}
          templates={templates}
          onSubmit={(values) => {
            if (editing) updateMutation.mutate({ id: editing.id, payload: values });
            else createMutation.mutate(values);
          }}
        />
      </Modal>
    </div>
  );
}