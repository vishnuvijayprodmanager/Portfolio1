"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DocRef } from "@/lib/content";
import DeckViewer from "./DeckViewer";

type OpenArgs = { doc: DocRef | null | undefined; title: string; meta?: string };

const DeckViewerCtx = createContext<((args: OpenArgs) => void) | null>(null);

export function useDeckViewer() {
  const ctx = useContext(DeckViewerCtx);
  if (!ctx) throw new Error("useDeckViewer must be used within DeckViewerProvider");
  return ctx;
}

export default function DeckViewerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OpenArgs | null>(null);

  const open = useCallback((args: OpenArgs) => setState(args), []);
  const close = useCallback(() => setState(null), []);

  const value = useMemo(() => open, [open]);

  return (
    <DeckViewerCtx.Provider value={value}>
      {children}
      <DeckViewer
        open={!!state}
        doc={state?.doc}
        title={state?.title || ""}
        meta={state?.meta}
        onClose={close}
      />
    </DeckViewerCtx.Provider>
  );
}
