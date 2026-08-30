"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SearchModalContextValue = {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

const SearchModalContext = createContext<SearchModalContextValue | null>(null);

export function SearchModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openSearch, closeSearch }),
    [open, openSearch, closeSearch],
  );

  return (
    <SearchModalContext.Provider value={value}>
      {children}
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const ctx = useContext(SearchModalContext);
  if (!ctx) {
    throw new Error("useSearchModal must be used within SearchModalProvider");
  }
  return ctx;
}

export function useSearchModalActions() {
  const { openSearch, closeSearch } = useSearchModal();
  return { openSearch, closeSearch };
}
