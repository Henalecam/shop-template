"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Tenant = {
  id: string;
  name: string;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  pix_key?: string | null;
};

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  image_url?: string | null;
};

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "/api";

const STYLES: Record<string, { headerBg?: string; accent?: string; font?: string; card?: string }> = {
  minimal: { headerBg: "#ffffff", accent: "#111827", font: "sans-serif", card: "border rounded" },
  skate: { headerBg: "#0ea5e9", accent: "#111827", font: "Impact, sans-serif", card: "border-[3px] border-black" },
  sneakers: { headerBg: "#111827", accent: "#22d3ee", font: "Helvetica, Arial, sans-serif", card: "shadow-lg" },
  streetwear: { headerBg: "#1f2937", accent: "#f59e0b", font: "Arial Black, Arial, sans-serif", card: "border-2 border-gray-800" },
  electronics: { headerBg: "#0f172a", accent: "#38bdf8", font: "Inter, system-ui, sans-serif", card: "shadow border border-slate-800" },
};

const FALLBACK_PRODUCTS: Record<string, Product[]> = {
  minimal: [
    { id: "p1", name: "Camiseta Básica", description: "100% algodão", price: "49.90" },
    { id: "p2", name: "Tênis Conforto", description: "Dia a dia", price: "199.90" },
    { id: "p3", name: "Mochila Urbana", description: "Resistente e leve", price: "129.90" },
  ],
  skate: [
    { id: "p1", name: "Shape Maple 8.0", description: "7 camadas", price: "349.90" },
    { id: "p2", name: "Roda 52mm", description: "Dureza 99A", price: "129.90" },
    { id: "p3", name: "Truck Low 139mm", description: "Leve", price: "279.90" },
  ],
  sneakers: [
    { id: "p1", name: "Tênis Runner X", description: "Amortecimento", price: "399.90" },
    { id: "p2", name: "Tênis Street Pro", description: "Vulcanizado", price: "299.90" },
    { id: "p3", name: "Meia Performance", description: "Suporte no arco", price: "39.90" },
  ],
  streetwear: [
    { id: "p1", name: "Camiseta Oversized", description: "Malha 230gsm", price: "119.90" },
    { id: "p2", name: "Calça Cargo", description: "Vários bolsos", price: "199.90" },
    { id: "p3", name: "Boné Trucker", description: "Ajustável", price: "79.90" },
  ],
  electronics: [
    { id: "p1", name: "Smartphone ZX10", description: "128GB, Câmera 50MP", price: "2599.90" },
    { id: "p2", name: "Fone Bluetooth ANC", description: "Cancelamento de ruído", price: "699.90" },
    { id: "p3", name: "Notebook Slim 14", description: "i5, 16GB, SSD 512GB", price: "4599.90" },
  ],
};

export default function TemplatePreviewPage() {
  const params = useParams<{ slug: string }>();
  const slug = (params?.slug || "minimal").toString();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryMessage, setDeliveryMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const headers: HeadersInit = useMemo(() => {
    const h: Record<string, string> = {};
    let tenantFromUrl: string | null = null;
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      tenantFromUrl = p.get("tenantId");
    }
    if (tenantFromUrl) h["x-tenant-id"] = tenantFromUrl;
    return h;
  }, []);

  useEffect(() => {
    async function bootstrap() {
      try {
        setLoading(true);
        const [tenantRes, productsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/tenant`, { headers }),
          fetch(`${BACKEND_URL}/products`, { headers }),
        ]);
        if (!tenantRes.ok || !productsRes.ok) throw new Error("fallback");
        const tenantJson = await tenantRes.json();
        const productsJson = await productsRes.json();
        setTenant(tenantJson.tenant);
        setDeliveryMessage(tenantJson.delivery_message || "");
        setProducts(productsJson.products || []);
      } catch (e: unknown) {
        // Fallback estático para visualização sem backend
        setTenant({ id: `tenant-${slug}`, name: slug, primary_color: "#111827", secondary_color: "#6366f1" });
        setProducts(FALLBACK_PRODUCTS[slug] || FALLBACK_PRODUCTS.minimal);
        setError("");
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, [headers, slug]);

  const style = STYLES[slug] || STYLES.minimal;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-700">Carregando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen" style={{ fontFamily: style.font }}>
      <header className="w-full border-b" style={{ backgroundColor: style.headerBg }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          {tenant?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tenant.logo_url} alt={tenant.name} className="h-10 w-auto" />
          ) : (
            <div className="font-bold text-xl" style={{ color: style.accent }}>{tenant?.name || "Loja"}</div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {deliveryMessage && <div className="mb-6 text-sm text-gray-700">{deliveryMessage}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className={`bg-white ${style.card} overflow-hidden flex flex-col`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image_url || "https://via.placeholder.com/600x400?text=Produto"}
                alt={p.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-semibold text-gray-900 mb-1">{p.name}</div>
                {p.description && <div className="text-sm text-gray-600 line-clamp-3 mb-3">{p.description}</div>}
                <div className="mt-auto flex items-center justify-between">
                  <div className="text-lg font-bold" style={{ color: style.accent }}>
                    {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(p.price))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t">
        <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-500">© {new Date().getFullYear()} {tenant?.name || "Loja"}</div>
      </footer>
    </div>
  );
}