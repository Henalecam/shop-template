"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/templates', label: 'Templates' },
  { href: '/products', label: 'Produtos' },
  { href: '/tenants', label: 'Tenants' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
      <nav className="container-page flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold text-slate-100">
          Admin MVP
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === href ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}