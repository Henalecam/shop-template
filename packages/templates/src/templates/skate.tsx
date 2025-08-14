"use client";
import { useEffect, useMemo, useState } from "react";

type Tenant = { id: string; name: string; primary_color?: string; secondary_color?: string; logo_url?: string | null };

type Product = { id: string; name: string; description?: string | null; price: string | number; image_url?: string | null };

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "/api";

const FALLBACK_PRODUCTS: Product[] = [
	{ id: "p1", name: "Shape Maple 8.0", description: "7 camadas", price: "349.90" },
	{ id: "p2", name: "Roda 52mm", description: "Dureza 99A", price: "129.90" },
	{ id: "p3", name: "Truck Low 139mm", description: "Leve", price: "279.90" },
];

export default function Skate({ tenantId }: { tenantId?: string }) {
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
				setTenant({ id: "tenant-skate", name: "skate", primary_color: "#0ea5e9", secondary_color: "#111827" });
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

	const primary = tenant?.primary_color || "#0ea5e9";
	const secondary = tenant?.secondary_color || "#111827";

	return (
		<div className="min-h-[60vh] bg-white text-gray-900" style={{ fontFamily: "Impact, sans-serif" }}>
			<header className="w-full border-b" style={{ backgroundColor: primary }}>
				<div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
					{tenant?.logo_url ? (
						<img src={tenant.logo_url} alt={tenant.name} className="h-10 w-auto" />
					) : (
						<div className="font-bold text-xl text-black drop-shadow">{tenant?.name || "Loja"}</div>
					)}
				</div>
			</header>
			<main className="max-w-5xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{uniqueProducts.map((p) => (
						<div key={p.id} className="bg-white border-[3px] border-black rounded p-4 flex flex-col gap-1">
							<div className="font-semibold text-gray-900">{p.name}</div>
							<div className="text-lg font-bold" style={{ color: secondary }}>
								{formatBRL(Number(p.price))}
							</div>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}