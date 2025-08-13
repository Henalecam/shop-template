"use client";

import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from 'react';

export default function DetailsDrawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 420, backgroundColor: '#0f172a' } }}>
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <IconButton onClick={onClose} aria-label="Fechar" size="small" color="inherit">
          <CloseIcon />
        </IconButton>
      </div>
      <div className="p-4 text-sm text-slate-200">{children}</div>
    </Drawer>
  );
}