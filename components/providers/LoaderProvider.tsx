"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type LoaderActions = {
  show: (key: string) => void;
  hide: (key: string) => void;
};

// Actions never change identity, so components that only need to trigger
// the loader (e.g. Hero) can subscribe without re-rendering whenever the
// loading state itself flips. Mixing the two in one context previously
// caused Hero to re-render on every show/hide, which recreated the inline
// props passed to <Globe> and retriggered its whole load effect in a loop.
const LoaderActionsContext = createContext<LoaderActions | null>(null);
const LoaderStateContext = createContext(false);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const activeKeys = useRef<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const show = useCallback((key: string) => {
    activeKeys.current.add(key);
    setIsLoading(true);
  }, []);

  const hide = useCallback((key: string) => {
    activeKeys.current.delete(key);
    setIsLoading(activeKeys.current.size > 0);
  }, []);

  const actions = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <LoaderActionsContext.Provider value={actions}>
      <LoaderStateContext.Provider value={isLoading}>
        {children}
      </LoaderStateContext.Provider>
    </LoaderActionsContext.Provider>
  );
}

// For components that trigger loading (e.g. RouteLoader). Stable identity.
export function useLoader() {
  const ctx = useContext(LoaderActionsContext);
  if (!ctx) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return ctx;
}

// For the visual overlay only. Re-renders on every change, by design.
export function useLoaderState() {
  return useContext(LoaderStateContext);
}
