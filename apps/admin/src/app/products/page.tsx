'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import DataTable from '@/components/DataTable';
import DetailsDrawer from '@/components/DetailsDrawer';
import type { Product } from '@/types';
import { GridColDef } from '@mui/x-data-grid';

export default function ProductsPage() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ['products'], queryFn: api.products });
  const [selected, setSelected] = useState<Product | null>(null);

  const columns = useMemo<GridColDef<Product>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 120 },
      { field: 'name', headerName: 'Nome', flex: 1, minWidth: 160 },
      { field: 'sku', headerName: 'SKU', width: 120 },
      { field: 'price', headerName: 'Preço', width: 120, valueFormatter: (v) => (v?.value != null ? `US$ ${v.value}` : '') },
      { field: 'status', headerName: 'Status', width: 120 },
    ],
    []
  );

  if (error) return <div className="text-red-400">Erro ao carregar produtos</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Produtos</h1>
      <DataTable rows={data} columns={columns} pageSize={10} loading={isLoading} onRowClick={(row) => setSelected(row)} />
      <DetailsDrawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? 'Detalhes'}>
        {selected && (
          <div className="space-y-2">
            <div>
              <span className="text-slate-400">ID: </span>
              <span>{selected.id}</span>
            </div>
            {selected.sku && (
              <div>
                <span className="text-slate-400">SKU: </span>
                <span>{selected.sku}</span>
              </div>
            )}
            {selected.price != null && (
              <div>
                <span className="text-slate-400">Preço: </span>
                <span>US$ {selected.price}</span>
              </div>
            )}
            {selected.tags && selected.tags.length > 0 && (
              <div>
                <span className="text-slate-400">Tags: </span>
                <span>{selected.tags.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
}