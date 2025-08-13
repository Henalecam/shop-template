"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="vstack">
      <h1>Admin</h1>
      <div className="grid three">
        <div className="card section vstack">
          <div className="hstack" style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 600 }}>Tenants</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>Gerencie lojas e configurações</div>
            </div>
            <Link href="/tenants" className="btn primary">Abrir</Link>
          </div>
        </div>
        <div className="card section vstack">
          <div className="hstack" style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 600 }}>Produtos</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>Cadastro e edição de produtos</div>
            </div>
            <Link href="/products" className="btn primary">Abrir</Link>
          </div>
        </div>
        <div className="card section vstack">
          <div className="hstack" style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 600 }}>Templates</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>E-commerces de nichos</div>
            </div>
            <Link href="/templates" className="btn primary">Abrir</Link>
          </div>
        </div>
      </div>
    </div>
  );
}