"use client";
import { useEffect, useMemo, useState } from "react";

type Tenant = { id: string; name: string; primary_color?: string; secondary_color?: string };

type Product = { id: string; name: string; description?: string | null; price: string | number; image_url?: string | null };

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "/api";

const FALLBACK_PRODUCTS: Product[] = [
	{ id: "s1", name: "Sneaker Runner X", description: "Amortecimento responsivo, pronto pra rua.", price: "399.90" },
	{ id: "s2", name: "Sneaker Street Pro", description: "Solado vulcanizado e aderência máxima.", price: "299.90" },
	{ id: "s3", name: "Meia Performance", description: "Suporte no arco e respirabilidade premium.", price: "39.90" },
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
				setTenant({ id: "tenant-sneakers", name: "Sneaker Point", primary_color: "#0a0a0a", secondary_color: "#84cc16" });
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

	const accent = tenant?.secondary_color || "#84cc16"; // lime vibe street
	const brand = tenant?.name || "Sneaker Point";

	if (loading) return <div className="p-6 text-zinc-300">Carregando...</div>;
	if (error) return <div className="p-6 text-red-500">{error}</div>;

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
				<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 rounded bg-zinc-100" style={{ boxShadow: `0 0 24px ${accent}66`, background: `linear-gradient(135deg, ${accent}, #22d3ee)` }} />
						<div className="font-extrabold tracking-wide text-xl" style={{ color: accent }}>{brand}</div>
					</div>
					<nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-300">
						<a href="#catalogo" className="hover:text-white">Catálogo</a>
						<a href="#drops" className="hover:text-white">Drops</a>
						<a href="#sobre" className="hover:text-white">Sobre</a>
					</nav>
					<button className="px-3 py-2 rounded-md text-zinc-900 text-sm font-semibold" style={{ backgroundColor: accent }} onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}>
						Comprar agora
					</button>
				</div>
			</header>

			{/* Hero */}
			<section className="relative overflow-hidden">
				<div className="pointer-events-none absolute inset-0 opacity-40" style={{
					backgroundImage: `radial-gradient(1200px 600px at -10% 0%, #22d3ee22, transparent), radial-gradient(800px 400px at 110% 20%, ${accent}22, transparent), radial-gradient(600px 300px at 50% 120%, #ef444422, transparent)`
				}} />
				<div className="max-w-6xl mx-auto px-4 py-14 sm:py-20 relative">
					<div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
						<span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
						Street approved
					</div>
					<h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
						<span className="text-white">Sneakers que</span>{' '}
						<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${accent}, #22d3ee)` }}>dominam a rua</span>
					</h1>
					<p className="mt-4 max-w-2xl text-zinc-300 text-base sm:text-lg">
						Drops limitados, clássicos repaginados e performance para o corre diário. A vibe é street, o preço é de oportunidade.
					</p>
					<div className="mt-6 flex flex-wrap items-center gap-3">
						<a href="#catalogo" className="px-5 py-3 rounded-md font-semibold text-zinc-900" style={{ backgroundColor: accent }}>Ver catálogo</a>
						<a href="#drops" className="px-5 py-3 rounded-md border border-zinc-800 text-zinc-200 hover:bg-zinc-900/60">Últimos drops</a>
					</div>
					<div className="mt-10 flex flex-wrap gap-4 text-xs text-zinc-400">
						<div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
							<span className="i-[truck]" /> Entrega rápida
						</div>
						<div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
							Troca fácil
						</div>
						<div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
							Parcelamento
						</div>
					</div>
				</div>
			</section>

			{/* Catálogo */}
			<main id="catalogo" className="max-w-6xl mx-auto px-4 pb-16">
				<div className="flex items-center justify-between gap-4 mb-6">
					<h2 className="text-xl font-bold text-zinc-200">Catálogo em destaque</h2>
					<div className="hidden sm:flex items-center gap-2">
						<button className="px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300">Todos</button>
						<button className="px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300">Street</button>
						<button className="px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300">Performance</button>
						<button className="px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300">Acessórios</button>
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
					{uniqueProducts.map((p) => {
						const current = Number(p.price);
						const original = current * 1.5;
						return (
							<div key={p.id} className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900/80 transition-colors">
								{/* Badge desconto */}
								<div className="absolute left-3 top-3 z-10 select-none px-2 py-1 rounded-full text-[10px] font-bold text-zinc-900" style={{ backgroundColor: accent }}>50% OFF</div>

								{/* Media */}
								<div className="relative aspect-[4/3] w-full overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50" />
									{p.image_url ? (
										<img src={p.image_url} alt={p.name} className="absolute inset-0 h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
									) : (
										<div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
									)}
									<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950/90 to-transparent" />
								</div>

								{/* Conteúdo */}
								<div className="p-4 flex flex-col gap-2">
									<div className="flex items-center justify-between gap-2">
										<div className="font-semibold text-white line-clamp-1">{p.name}</div>
										<span className="text-[10px] px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-300">Novo</span>
									</div>
									{p.description && <div className="text-xs text-zinc-400 line-clamp-2">{p.description}</div>}

									<div className="mt-1 flex items-end justify-between">
										<div className="flex flex-col">
											<span className="text-zinc-500 line-through text-xs">{formatBRL(original)}</span>
											<span className="text-2xl font-extrabold" style={{ color: accent }}>{formatBRL(current)}</span>
										</div>
										<button className="px-3 py-2 rounded-md text-zinc-900 text-sm font-semibold group-hover:shadow-[0_0_0_3px_rgba(0,0,0,0.2)] transition-shadow" style={{ backgroundColor: accent }} onClick={() => alert('Comprar: ' + p.name)}>
											Comprar
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</main>

			{/* Drops */}
			<section id="drops" className="max-w-6xl mx-auto px-4 pb-16">
				<div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h3 className="text-lg font-bold text-white">Fique por dentro dos próximos drops</h3>
							<p className="text-sm text-zinc-400 mt-1">Coleções limitadas, lançamentos e ofertas exclusivas direto no seu e-mail.</p>
						</div>
						<form className="flex w-full sm:w-auto items-center gap-2">
							<input type="email" required placeholder="Seu e-mail" className="w-full sm:w-64 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-600 focus:border-zinc-700" />
							<button type="submit" className="px-4 py-2 rounded-md text-zinc-900 text-sm font-semibold" style={{ backgroundColor: accent }}>Assinar</button>
						</form>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer id="sobre" className="border-t border-zinc-800">
				<div className="max-w-6xl mx-auto px-4 py-10 text-sm text-zinc-400">
					<div className="flex flex-col sm:flex-row items-start justify-between gap-6">
						<div>
							<div className="font-extrabold tracking-wide text-white" style={{ color: accent }}>{brand}</div>
							<p className="mt-2 max-w-md">Sua loja de sneakers com alma de rua. Qualidade, conforto e estilo no mesmo corre.</p>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
							<div className="space-y-1">
								<div className="text-zinc-300 font-semibold">Loja</div>
								<a className="block hover:text-zinc-200" href="#catalogo">Catálogo</a>
								<a className="block hover:text-zinc-200" href="#drops">Drops</a>
							</div>
							<div className="space-y-1">
								<div className="text-zinc-300 font-semibold">Suporte</div>
								<a className="block hover:text-zinc-200" href="#">Trocas e devoluções</a>
								<a className="block hover:text-zinc-200" href="#">Frete</a>
							</div>
							<div className="space-y-1">
								<div className="text-zinc-300 font-semibold">Legal</div>
								<a className="block hover:text-zinc-200" href="#">Privacidade</a>
								<a className="block hover:text-zinc-200" href="#">Termos</a>
							</div>
						</div>
					</div>
					<div className="mt-8 text-xs">© {new Date().getFullYear()} {brand}. Todos os direitos reservados.</div>
				</div>
			</footer>
		</div>
	);
}