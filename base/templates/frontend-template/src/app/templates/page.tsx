"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "/api";

type Template = {
  id: string;
  name: string;
  slug: string;
  preview_url?: string;
  preview_url_filled?: string | null;
};

const FALLBACK_TEMPLATES: Template[] = [
  { id: "t-minimal", name: "Minimal", slug: "minimal", preview_url: "/templates/minimal" },
  { id: "t-skate", name: "Skate Shop", slug: "skate", preview_url: "/templates/skate" },
  { id: "t-sneakers", name: "Sneakers Store", slug: "sneakers", preview_url: "/templates/sneakers" },
  { id: "t-streetwear", name: "Street Wear", slug: "streetwear", preview_url: "/templates/streetwear" },
  { id: "t-electronics", name: "Electronics", slug: "electronics", preview_url: "/templates/electronics" },
  { id: "t-decor", name: "Home & Decor", slug: "decor", preview_url: "/templates/decor" },
];

export default function TemplatesIndex() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/templates`);
        if (!res.ok) throw new Error("Falha ao carregar templates");
        const data = await res.json();
        setTemplates((data.templates || []) as Template[]);
      } catch (e: unknown) {
        // Fallback para visualização sem backend
        setTemplates(FALLBACK_TEMPLATES);
        setError("");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto p-6">Carregando...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Templates</h1>
      <p className="text-sm text-gray-700">Clique para visualizar um preview com dados de exemplo.</p>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      <ul className="list-disc ml-6 mt-4 text-sm text-gray-700 space-y-2">
        {templates.map((t) => (
          <li key={t.id}>
            <Link
              className="text-blue-600 hover:underline"
              href={t.preview_url_filled || t.preview_url || `/templates/${t.slug}`}
              prefetch={false}
            >
              {t.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}