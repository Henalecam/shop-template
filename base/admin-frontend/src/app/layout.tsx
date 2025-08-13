import { Providers } from "./providers";
import "./globals.css";
import Link from "next/link";

function Nav() {
  return (
    <header className="appbar">
      <div className="container appbar-inner">
        <Link href="/" className="hstack" style={{ gap: 10, textDecoration: "none" }}>
          <span style={{ fontWeight: 700 }}>Admin</span>
          <span className="badge gray">MVP</span>
        </Link>
        <nav className="hstack nav" style={{ gap: 6 }}>
          <Link href="/">Dashboard</Link>
          <Link href="/tenants">Tenants</Link>
          <Link href="/products">Produtos</Link>
          <Link href="/templates">Templates</Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Nav />
        <main className="container" style={{ paddingTop: 16 }}>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}