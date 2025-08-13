"use client";

import { ReactNode, useEffect } from "react";

export default function Modal({ open, title, onClose, children }: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card modal" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <div style={{ fontWeight: 600 }}>{title}</div>
          <button className="btn ghost" onClick={onClose}>Fechar</button>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}