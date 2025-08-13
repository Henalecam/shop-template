import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", gap: 12 }}>
          <strong>Admin</strong>
          <a href="/" style={{ color: "#555" }}>Tenants</a>
          <a href="/products" style={{ color: "#555" }}>Produtos</a>
          <a href="/templates" style={{ color: "#555" }}>Templates</a>
        </header>
        <main style={{ padding: 16 }}>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}