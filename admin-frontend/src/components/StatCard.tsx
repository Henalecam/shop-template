import Link from 'next/link';

export default function StatCard({ title, value, href }: { title: string; value: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-slate-900/40 p-4 ring-1 ring-slate-800 transition hover:bg-slate-900/70"
    >
      <div className="text-slate-300">{title}</div>
      <div className="text-lg font-medium">{value}</div>
    </Link>
  );
}