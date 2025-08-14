"use client";
import { useEffect, useMemo, useState } from "react";

// Types
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
  price: string | number; // price comes as string from API (Decimal)
  image_url?: string | null;
};

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "/api";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID as string | undefined;

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Camiseta Básica",
    description: "Camiseta 100% algodão",
    price: "49.90",
    image_url: "https://images.unsplash.com/photo-1520975922284-9d26d111fadd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "p2",
    name: "Tênis Conforto",
    description: "Ideal para o dia a dia",
    price: "199.90",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "p3",
    name: "Mochila Urbana",
    description: "Resistente e leve",
    price: "129.90",
    image_url: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Home() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryMessage, setDeliveryMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrOpen, setQrOpen] = useState<boolean>(false);

  const [buyOpen, setBuyOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cross, setCross] = useState<Product | null>(null);
  const [includeCross, setIncludeCross] = useState<boolean>(true);

  const headers: HeadersInit = useMemo(() => {
    const h: Record<string, string> = {};
    let tenantFromUrl: string | null = null;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      tenantFromUrl = params.get("tenantId");
    }
    const id = tenantFromUrl || TENANT_ID;
    if (id) h["x-tenant-id"] = id;
    return h;
  }, []);

  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    const list: Product[] = [];
    for (const p of products) {
      const key = Number(p.price).toFixed(2);
      if (!seen.has(key)) {
        seen.add(key);
        list.push(p);
      }
    }
    return list;
  }, [products]);

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
        setTenant({ id: "tenant-minimal", name: "minimal", primary_color: "#111827", secondary_color: "#6366f1" });
        setProducts(FALLBACK_PRODUCTS);
        setError("");
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, [headers]);

  function formatBRL(value: number) {
    return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }

  function openBuy(product: Product) {
    setSelected(product);
    const other = (products || []).find((p) => p.id !== product.id) || null;
    setCross(other);
    setIncludeCross(!!other);
    setBuyOpen(true);
  }

  function closeBuy() {
    setBuyOpen(false);
    setSelected(null);
    setCross(null);
    setIncludeCross(true);
  }

  async function handlePix(productId: string) {
    try {
      setError("");
      setQrDataUrl("");
      const res = await fetch(`${BACKEND_URL}/payment/pix/${productId}`, {
        headers,
      });
      if (!res.ok) throw new Error("Falha ao gerar Pix");
      const data = await res.json();
      setQrDataUrl(data.qrcode?.data_url || "");
      setQrOpen(true);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Erro ao gerar Pix";
      setError(message);
    }
  }

  const primary = tenant?.primary_color || "#111827";
  const secondary = tenant?.secondary_color || "#6366f1";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">Carregando...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          {tenant?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tenant.logo_url} alt={tenant.name} className="h-10 w-auto" />
          ) : (
            <div className="font-bold text-xl" style={{ color: primary }}>{tenant?.name || "Loja"}</div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {deliveryMessage && (
          <div className="mb-6 text-sm text-gray-700">{deliveryMessage}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-lg border p-4 flex flex-col gap-1">
              <div className="font-semibold text-gray-900">{p.name}</div>
              <div className="text-lg font-bold" style={{ color: primary }}>
                {formatBRL(Number(p.price))}
              </div>
            </div>
          ))}
        </div>
      </main>





      <footer className="border-t bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} {tenant?.name || "Loja"}
        </div>
      </footer>
    </div>
  );
}
