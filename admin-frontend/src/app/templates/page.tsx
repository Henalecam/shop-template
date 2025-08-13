'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import DataTable from '@/components/DataTable';
import DetailsDrawer from '@/components/DetailsDrawer';
import type { Template } from '@/types';
import { GridColDef } from '@mui/x-data-grid';

export default function TemplatesPage() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ['templates'], queryFn: api.templates });
  const [selected, setSelected] = useState<Template | null>(null);

  const columns = useMemo<GridColDef<Template>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 120 },
      { field: 'name', headerName: 'Nome', flex: 1, minWidth: 160 },
      { field: 'category', headerName: 'Categoria', width: 140 },
      { field: 'status', headerName: 'Status', width: 120 },
      { field: 'createdAt', headerName: 'Criado em', width: 160 },
    ],
    []
  );

  if (error) return <div className="text-red-400">Erro ao carregar templates</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Templates</h1>
      <DataTable
        rows={data}
        columns={columns}
        pageSize={10}
        loading={isLoading}
        onRowClick={(row) => setSelected(row)}
      />
      <DetailsDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? 'Detalhes'}
      >
        {selected && (
          <div className="space-y-2">
            <div>
              <span className="text-slate-400">ID: </span>
              <span>{selected.id}</span>
            </div>
            {selected.description && (
              <div>
                <span className="text-slate-400">Descrição: </span>
                <span>{selected.description}</span>
              </div>
            )}
            {selected.category && (
              <div>
                <span className="text-slate-400">Categoria: </span>
                <span>{selected.category}</span>
              </div>
            )}
            {selected.previewUrl && (
              <a
                className="inline-block rounded-md bg-brand-600 px-3 py-2 text-sm hover:bg-brand-500"
                href={selected.previewUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver preview
              </a>
            )}
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
}