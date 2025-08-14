"use client";
import { Providers } from "./providers";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Nav() {
  const pathname = usePathname();
  return (
    <header className="appbar">
      <div className="container appbar-inner">
        <Link href="/" className="hstack" style={{ gap: 10, textDecoration: "none" }}>
          <span style={{ fontWeight: 700 }}>Admin</span>
          <span className="badge gray">MVP</span>
        </Link>
        <nav className="hstack nav" style={{ gap: 6 }}>
          <Link href="/" className={pathname === "/" ? "active" : undefined}>Dashboard</Link>
          <Link href="/tenants" className={pathname?.startsWith("/tenants") ? "active" : undefined}>Tenants</Link>
          <Link href="/products" className={pathname?.startsWith("/products") ? "active" : undefined}>Produtos</Link>
          <Link href="/templates" className={pathname?.startsWith("/templates") ? "active" : undefined}>Templates</Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: Parameters<typeof Providers>[0]["children"] }) {
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