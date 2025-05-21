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
interface FilterState {
  search: string;
  sortKeys: string[];
  onlyWithImages: boolean;
  viewCols: 1 | 2;
}

// 2) Definiere, wie man sie verändern kann:
interface FilterActions {
  setSearch: Dispatch<SetStateAction<string>>;
  setSortKeys: Dispatch<SetStateAction<string[]>>;
  setOnlyWithImages: Dispatch<SetStateAction<boolean>>;
  setViewCols: Dispatch<SetStateAction<1 | 2>>;
}

// 3) Kombiniere beides in einem Context-Typ:
const FilterContext = createContext<(FilterState & FilterActions) | undefined>(
  undefined
);

// 4) Erstelle den Provider, der State verwaltet und weitergibt:
export function FilterProvider({ children }: { children: ReactNode }) {
  const [search, _setSearch] = useState<string>("");
  const [sortKeys, _setSortKeys] = useState<string[]>(["date"]);
  const [onlyWithImages, _setOnlyWithImages] = useState<boolean>(true);
  const [viewCols, _setViewCols] = useState<1 | 2>(2);

  const setSearch: Dispatch<SetStateAction<string>> = _setSearch;
  const setSortKeys: Dispatch<SetStateAction<string[]>> = _setSortKeys;
  const setOnlyWithImages: Dispatch<SetStateAction<boolean>> =
    _setOnlyWithImages;
  const setViewCols: Dispatch<SetStateAction<1 | 2>> = _setViewCols;

  return (
    <FilterContext.Provider
      value={{
        search,
        setSearch,
        sortKeys,
        setSortKeys,
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
