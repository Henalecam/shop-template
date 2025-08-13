"use client";

import { DataGrid, GridColDef, GridToolbar, GridRowParams } from '@mui/x-data-grid';

export default function DataTable<T extends { id: string | number }>({
  rows,
  columns,
  pageSize = 10,
  loading,
  onRowClick,
}: {
  rows: T[];
  columns: GridColDef<T>[];
  pageSize?: number;
  loading?: boolean;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div style={{ width: '100%' }} className="rounded-lg bg-slate-900/40 p-2 ring-1 ring-slate-800">
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        loading={loading}
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize } } }}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } as any }}
        onRowClick={(params: GridRowParams<T>) => onRowClick?.(params.row)}
      />
    </div>
  );
}