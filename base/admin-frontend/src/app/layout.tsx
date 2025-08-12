import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
          <strong>Admin</strong>
        </header>
        <main style={{ padding: 16 }}>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}