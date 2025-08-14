"use client";
import { useEffect, useMemo, useState } from "react";

type Tenant = { id: string; name: string; primary_color?: string; secondary_color?: string };

type Product = { id: string; name: string; description?: string | null; price: string | number; image_url?: string | null };

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "/api";

const FALLBACK_PRODUCTS: Product[] = [
	{ id: "s1", name: "Sneaker Runner X", description: "Amortecimento", price: "399.90" },
	{ id: "s2", name: "Sneaker Street Pro", description: "Vulcanizado", price: "299.90" },
	{ id: "s3", name: "Meia Performance", description: "Suporte no arco", price: "39.90" },
];

export default function Sneakers({ tenantId }: { tenantId?: string }) {
	const [tenant, setTenant] = useState<Tenant | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	const headers: HeadersInit = useMemo(() => {
		const h: Record<string, string> = {};
		if (tenantId) h["x-tenant-id"] = tenantId;
		return h;
	}, [tenantId]);

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
				setProducts(productsJson.products || []);
			} catch {
				setTenant({ id: "tenant-sneakers", name: "sneakers", primary_color: "#111827", secondary_color: "#22d3ee" });
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

	return (
		<div className="min-h-[60vh]" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
			<header className="w-full border-b" style={{ backgroundColor: '#111827' }}>
				<div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
					<div className="font-bold text-xl text-white">{tenant?.name || 'Loja'}</div>
					<div className="text-sm text-slate-300">{new Date().getFullYear()}</div>
				</div>
			</header>
			<main className="max-w-5xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{uniqueProducts.map((p) => (
						<div key={p.id} className="bg-white shadow-lg overflow-hidden">
							<div className="h-40 w-full bg-gradient-to-br from-cyan-100 to-white" />
							<div className="p-4 flex flex-col gap-2">
								<div className="font-semibold text-gray-900">{p.name}</div>
								{p.description && <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>}
								<div className="mt-1 flex items-center justify-between">
									<div className="text-lg font-bold text-cyan-400">
										{formatBRL(Number(p.price))}
									</div>
									<button className="px-3 py-2 rounded-md bg-cyan-500 text-white text-sm" onClick={() => alert('Comprar: ' + p.name)}>
										Comprar
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}