'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import DataTable from '@/components/DataTable';
import DetailsDrawer from '@/components/DetailsDrawer';
import type { Tenant } from '@/types';
import { GridColDef } from '@mui/x-data-grid';

export default function TenantsPage() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ['tenants'], queryFn: api.tenants });
  const [selected, setSelected] = useState<Tenant | null>(null);

  const columns = useMemo<GridColDef<Tenant>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 120 },
      { field: 'name', headerName: 'Nome', flex: 1, minWidth: 160 },
      { field: 'domain', headerName: 'Domínio', width: 180 },
      { field: 'plan', headerName: 'Plano', width: 120 },
      { field: 'status', headerName: 'Status', width: 120 },
      { field: 'usersCount', headerName: 'Usuários', width: 110 },
    ],
    []
  );

  if (error) return <div className="text-red-400">Erro ao carregar tenants</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Tenants</h1>
      <DataTable rows={data} columns={columns} pageSize={10} loading={isLoading} onRowClick={(row) => setSelected(row)} />
      <DetailsDrawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? 'Detalhes'}>
        {selected && (
          <div className="space-y-2">
            <div>
              <span className="text-slate-400">ID: </span>
              <span>{selected.id}</span>
            </div>
            {selected.domain && (
              <div>
                <span className="text-slate-400">Domínio: </span>
                <span>{selected.domain}</span>
              </div>
            )}
            {selected.plan && (
              <div>
                <span className="text-slate-400">Plano: </span>
                <span>{selected.plan}</span>
              </div>
            )}
            {selected.productsCount != null && (
              <div>
                <span className="text-slate-400">Produtos: </span>
                <span>{selected.productsCount}</span>
              </div>
            )}
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
}