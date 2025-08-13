"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Modal from "../../components/Modal";
import { api, Product, Tenant } from "../../lib/api";

function ProductForm({ initial, onSubmit }: { initial?: Partial<Product>; onSubmit: (v: Partial<Product>) => void }) {
  const [values, setValues] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: "",
    image_url: "",
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
          <label>Preço</label>
          <input className="input" type="number" step="0.01" value={values.price as any || ""} onChange={(e) => setValues(v => ({ ...v, price: e.target.value }))} required />
        </div>
      </div>
      <div>
        <label>Descrição</label>
        <textarea className="input" rows={3} value={values.description || ""} onChange={(e) => setValues(v => ({ ...v, description: e.target.value }))} />
      </div>
      <div>
        <label>Imagem (URL)</label>
        <input className="input" value={values.image_url || ""} onChange={(e) => setValues(v => ({ ...v, image_url: e.target.value }))} />
      </div>
      <div className="hstack" style={{ justifyContent: "flex-end" }}>
        <button type="submit" className="btn primary">Salvar</button>
      </div>
    </form>
  );
}

export default function ProductsPage() {
  const qc = useQueryClient();
  const { data: tenants = [] } = useQuery({ queryKey: ["tenants"], queryFn: api.listTenants });
  const [tenantId, setTenantId] = useState<string>("");

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products", tenantId],
    queryFn: () => api.listProducts(tenantId),
    enabled: !!tenantId,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Product>) => api.createProduct(tenantId, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products", tenantId] }); setModalOpen(false); setEditing(null); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Product> }) => api.updateProduct(tenantId, id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products", tenantId] }); setModalOpen(false); setEditing(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProduct(tenantId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products", tenantId] }),
  });

  const selectedTenant: Tenant | undefined = useMemo(() => tenants.find(t => t.id === tenantId), [tenants, tenantId]);

  return (
    <div className="vstack">
      <div className="hstack" style={{ justifyContent: "space-between" }}>
        <h1>Produtos</h1>
        <div className="hstack" style={{ gap: 8 }}>
          <select className="input" value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
            <option value="">Selecione um tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button className="btn primary" disabled={!tenantId} onClick={() => { setEditing(null); setModalOpen(true); }}>Novo produto</button>
        </div>
      </div>

      <div className="card section">
        {!tenantId && <div style={{ color: "var(--muted)" }}>Selecione um tenant para visualizar e gerenciar os produtos.</div>}
        {tenantId && (
          <>
            {isLoading && <div>Carregando...</div>}
            {error && <div style={{ color: "#fca5a5" }}>Erro ao carregar</div>}
            {products.length === 0 && !isLoading && <div style={{ color: "var(--muted)" }}>Nenhum produto cadastrado para {selectedTenant?.name}.</div>}
            {products.length > 0 && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th style={{ width: 200 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>R$ {p.price}</td>
                      <td className="hstack" style={{ gap: 8 }}>
                        <button className="btn ghost" onClick={() => { setEditing(p); setModalOpen(true); }}>Editar</button>
                        <button className="btn danger" onClick={() => { if (confirm("Excluir produto?")) deleteMutation.mutate(p.id); }}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar produto" : "Novo produto"}>
        <ProductForm
          initial={editing || undefined}
          onSubmit={(values) => {
            if (!tenantId) return;
            if (editing) updateMutation.mutate({ id: editing.id, payload: values });
            else createMutation.mutate(values);
          }}
        />
      </Modal>
    </div>
  );
}