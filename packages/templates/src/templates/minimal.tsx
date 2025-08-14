"use client";
import { useEffect, useMemo, useState } from "react";

type Tenant = { id: string; name: string; primary_color?: string; secondary_color?: string; logo_url?: string | null };

type Product = { id: string; name: string; description?: string | null; price: string | number; image_url?: string | null };

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "/api";

const FALLBACK_PRODUCTS: Product[] = [
	{ id: "p1", name: "Camiseta Básica", description: "100% algodão", price: "49.90" },
	{ id: "p2", name: "Tênis Conforto", description: "Dia a dia", price: "199.90" },
	{ id: "p3", name: "Mochila Urbana", description: "Resistente e leve", price: "129.90" },
];

export default function Minimal({ tenantId }: { tenantId?: string }) {
	const [tenant, setTenant] = useState<Tenant | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	const headers: HeadersInit = useMemo(() => {
		const h: Record<string, string> = {};
		if (tenantId) h["x-tenant-id"] = tenantId;
		return h;
	}, [tenantId]);

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
				setProducts(productsJson.products || []);
			} catch {
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

	if (loading) return <div className="p-4 text-gray-700">Carregando...</div>;
	if (error) return <div className="p-4 text-red-600">{error}</div>;

	const primary = tenant?.primary_color || "#111827";
	const secondary = tenant?.secondary_color || "#6366f1";

	return (
		<div className="min-h-[60vh] bg-white text-gray-900">
			<header className="w-full border-b bg-white">
				<div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
					{tenant?.logo_url ? (
						<img src={tenant.logo_url} alt={tenant.name} className="h-10 w-auto" />
					) : (
						<div className="font-bold text-xl" style={{ color: primary }}>{tenant?.name || "Loja"}</div>
					)}
				</div>
			</header>
			<main className="max-w-5xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((p) => (
						<div key={p.id} className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
							<img src={p.image_url || "https://via.placeholder.com/600x400?text=Produto"} alt={p.name} className="h-48 w-full object-cover" />
							<div className="p-4 flex-1 flex flex-col">
								<div className="font-semibold text-gray-900 mb-1">{p.name}</div>
								{p.description && <div className="text-sm text-gray-600 line-clamp-3 mb-3">{p.description}</div>}
								<div className="mt-auto flex items-center justify-between">
									<div className="text-lg font-bold" style={{ color: primary }}>
										{formatBRL(Number(p.price))}
									</div>
									<button className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: secondary }}>Comprar</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}