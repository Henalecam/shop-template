import Link from 'next/link';
import StatCard from '@/components/StatCard';

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Templates" value="Ver todos" href="/templates" />
        <StatCard title="Produtos" value="Ver todos" href="/products" />
        <StatCard title="Tenants" value="Ver todos" href="/tenants" />
      </div>

      <div className="rounded-lg bg-slate-900/40 p-6 ring-1 ring-slate-800">
        <h2 className="mb-2 text-lg font-medium">Bem-vindo ao Admin</h2>
        <p className="text-slate-300">
          Use o menu acima para navegar. As listas contam com busca, ordenação e
          visualização de detalhes.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/templates" className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium hover:bg-brand-500">
            Templates
          </Link>
          <Link href="/products" className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium hover:bg-sky-500">
            Produtos
          </Link>
          <Link href="/tenants" className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500">
            Tenants
          </Link>
        </div>
      </div>
    </div>
  );
}