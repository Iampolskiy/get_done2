"use client";

import { useFilter } from "@/app/context/FilterContext";
import { useRouter } from "next/navigation";
import { Sliders, Camera, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

// Definiere mögliche Sortier-Felder
export type SortKey = "progress" | "updates" | "category" | "date" | "random";

const sortFields: { key: SortKey; label: string }[] = [
  { key: "progress", label: "Fortschritt" },
  { key: "updates", label: "Updates" },
  { key: "category", label: "Kategorie" },
  { key: "date", label: "Datum" },
  { key: "random", label: "Zufällig" },
];

export default function SearchSortFilterSplitBar() {
  const router = useRouter();
  const {
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
  } = useFilter();

  const [showSearch, setShowSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const currentSort = sortKeys[0] as SortKey | undefined;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        showSearch &&
        formRef.current &&
        !formRef.current.contains(e.target as Node)
      ) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, showSearch]);

  function toggleSort(field: SortKey) {
    if (currentSort === field) {
      setSortDescending((prev) => !prev);
    } else {
      setSortKeys([field]);
      setSortDescending(true);
    }
    setDropdownOpen(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowSearch(false);
    router.push(`/challenges?search=${encodeURIComponent(search)}`);
  }

  return (
    <div className="relative flex items-center gap-2">
      {/* Such-Icon */}
      <button
        onClick={() => setShowSearch((v) => !v)}
        className={`p-0 rounded-full hover:bg-white/10 transition ${
          search ? "text-teal-300" : "text-white"
        }`}
        title="Suche"
      >
        <Search size={20} />
      </button>
      <AnimatePresence>
        {showSearch && (
          <motion.form
            ref={formRef}
            key="search-input"
            onSubmit={onSubmit}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex justify-center items-center z-50"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche…"
              autoFocus
              className="w-[80%] max-w-lg h-10 px-4 rounded-full border-2 border-teal-300 bg-black placeholder-teal-300 text-teal-300 focus:outline-none"
            />
          </motion.form>
        )}
      </AnimatePresence>

      {/* Sortieren */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center p-2 rounded-full hover:bg-white/10 transition text-white"
          title="Sortieren"
        >
          <Sliders size={20} />
          <span className="ml-2">
            {currentSort
              ? sortFields.find((f) => f.key === currentSort)?.label
              : "Sortieren"}
          </span>
        </button>
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-44 bg-black/80 text-white rounded-md shadow-lg overflow-hidden z-30"
            >
              {sortFields.map((field) => {
                const active = currentSort === field.key;
                return (
                  <button
                    key={field.key}
                    onClick={() => toggleSort(field.key)}
                    className={`flex items-center w-full text-left px-4 py-2 hover:bg-white/10 transition ${
                      active ? "bg-white/10 font-semibold" : ""
                    }`}
                  >
                    <span>{field.label}</span>
                    {active && field.key !== "random" && (
                      <ChevronDown
                        size={16}
                        className={`ml-auto transition-transform duration-200 ${
                          sortDescending ? "rotate-0" : "-rotate-180"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nur mit Bildern */}
      <button
        onClick={() => setOnlyWithImages((v) => !v)}
        className={`p-2 rounded-full hover:bg-white/10 transition ${
          onlyWithImages ? "text-teal-300" : "text-white/40"
        }`}
        title="Nur mit Bildern"
      >
        <Camera size={20} />
      </button>

      {/* Ansicht (Lämpchen) */}
      <button
        onClick={() => setViewCols((v) => (v === 2 ? 1 : 2))}
        className="flex items-center space-x-1 p-2 rounded-full hover:bg-white/10 transition"
        title="Ansicht wechseln"
      >
        {[1, 2].map((i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= viewCols ? "bg-teal-300" : "bg-white/30"
            }`}
          />
        ))}
      </button>
    </div>
  );
}
