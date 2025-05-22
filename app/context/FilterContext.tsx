"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// 1) Definiere, welche Werte du teilen willst:
export interface FilterState {
  search: string;
  sortKeys: string[];
  sortDescending: boolean;
  onlyWithImages: boolean;
  viewCols: 1 | 2;
}

// 2) Definiere, wie man sie verändern kann:
export interface FilterActions {
  setSearch: Dispatch<SetStateAction<string>>;
  setSortKeys: Dispatch<SetStateAction<string[]>>;
  setSortDescending: Dispatch<SetStateAction<boolean>>;
  setOnlyWithImages: Dispatch<SetStateAction<boolean>>;
  setViewCols: Dispatch<SetStateAction<1 | 2>>;
}

// 3) Kombiniere beides in einem Context-Typ:
const FilterContext = createContext<(FilterState & FilterActions) | undefined>(
  undefined
);

// 4) Erstelle den Provider, der State verwaltet und weitergibt:
export function FilterProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<string>("");
  const [sortKeys, setSortKeys] = useState<string[]>(["date"]);
  const [sortDescending, setSortDescending] = useState<boolean>(true);
  const [onlyWithImages, setOnlyWithImages] = useState<boolean>(true);
  const [viewCols, setViewCols] = useState<1 | 2>(2);

  return (
    <FilterContext.Provider
      value={{
        search,
        setSearch,
        sortKeys,
        setSortKeys,
        sortDescending,
        setSortDescending,
        onlyWithImages,
        setOnlyWithImages,
        viewCols,
        setViewCols,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// 5) Hook zum einfachen Zugriff im Code:
export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within a FilterProvider");
  return ctx;
}
