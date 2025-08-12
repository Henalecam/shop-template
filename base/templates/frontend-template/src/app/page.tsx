"use client";
import { useEffect, useMemo, useState } from "react";

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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID as string | undefined;

export default function Home() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryMessage, setDeliveryMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrOpen, setQrOpen] = useState<boolean>(false);

  const headers: HeadersInit = useMemo(() => {
    const h: Record<string, string> = {};
    if (TENANT_ID) h["x-tenant-id"] = TENANT_ID;
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
        if (!tenantRes.ok) throw new Error("Falha ao carregar tenant");
        if (!productsRes.ok) throw new Error("Falha ao carregar produtos");
        const tenantJson = await tenantRes.json();
        const productsJson = await productsRes.json();
        setTenant(tenantJson.tenant);
        setDeliveryMessage(tenantJson.delivery_message || "");
        setProducts(productsJson.products || []);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Erro ao carregar";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, [headers]);

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
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image_url || "https://via.placeholder.com/600x400?text=Produto"}
                alt={p.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-semibold text-gray-900 mb-1">{p.name}</div>
                {p.description && (
                  <div className="text-sm text-gray-600 line-clamp-3 mb-3">{p.description}</div>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <div className="text-lg font-bold" style={{ color: primary }}>
                    {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      Number(p.price)
                    )}
                  </div>
                  <button
                    onClick={() => handlePix(p.id)}
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: secondary }}
                  >
                    Pagar com Pix
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {qrOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" onClick={() => setQrOpen(false)}>
          <div className="bg-white rounded-lg p-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="font-semibold mb-3">Escaneie o QR Code para pagar</div>
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR Code Pix" className="w-full h-auto" />
            ) : (
              <div className="text-gray-600">Gerando QR Code...</div>
            )}
            <button
              onClick={() => setQrOpen(false)}
              className="mt-4 w-full px-4 py-2 rounded-md text-white"
              style={{ backgroundColor: primary }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <footer className="border-t bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} {tenant?.name || "Loja"}
        </div>
      </footer>
    </div>
  );
}
