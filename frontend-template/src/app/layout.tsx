import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loja Multi-Tenant",
  description: "Template de e-commerce multi-tenant",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
