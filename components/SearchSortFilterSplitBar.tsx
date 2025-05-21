"use client";

import { useFilter } from "@/app/context/FilterContext";
import { useRouter } from "next/navigation";
import { Sliders, Camera, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

export default function SearchSortFilterSplitBar() {
  const router = useRouter();
  const {
    search,
    setSearch,
    sortKeys,
    setSortKeys,
    onlyWithImages,
    setOnlyWithImages,
    viewCols,
    setViewCols,
  } = useFilter();

  const [showSearch, setShowSearch] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    "progress",
    "updates",
    "category",
    "date",
    "random",
  ] as const;
  const priorityColors = ["text-teal-300", "text-teal-200", "text-teal-100"];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        sortOpen &&
        sortRef.current &&
        !sortRef.current.contains(e.target as Node)
      ) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortOpen]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowSearch(false);
    router.push(`/challenges?search=${encodeURIComponent(search)}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search Toggle */}
      <button
        onClick={() => setShowSearch((v) => !v)}
        className={`p-2 rounded-full hover:bg-white/10 transition ${
          search ? "text-teal-300" : "text-white"
        }`}
        title="Suche"
      >
        <Search size={20} />
      </button>

      {/* Search Input (ohne zusätzliches Icon) */}
      <AnimatePresence>
        {showSearch && (
          <motion.form
            key="search-input"
            onSubmit={onSubmit}
            initial={false}
            animate={{ width: 140, opacity: 1, marginLeft: 8 }}
            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="overflow-hidden"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche…"
              autoFocus
              className="w-full px-4 py-2 rounded-full bg-white/10 placeholder-white/50 text-white focus:outline-none"
            />
          </motion.form>
        )}
      </AnimatePresence>

      {/* Sort-Dropdown */}
      <div className="relative" ref={sortRef}>
        <button
          onClick={() => setSortOpen((o) => !o)}
          className={`flex items-center p-2 rounded-full hover:bg-white/10 transition ${
            sortKeys.length ? "text-teal-300" : "text-white"
          }`}
          title="Sortieren"
        >
          <Sliders size={20} />
          <ChevronDown
            size={16}
            className={`ml-1 transition ${sortOpen ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {sortOpen && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-40 bg-black/80 text-white rounded-md shadow-lg overflow-hidden z-30"
            >
              {sortOptions.map((key) => {
                const pos = sortKeys.indexOf(key as string);
                const active = pos !== -1;
                const colorClass = active
                  ? priorityColors[Math.min(pos, priorityColors.length - 1)]
                  : "text-white";
                return (
                  <button
                    key={key}
                    onClick={() =>
                      setSortKeys((cur) =>
                        cur.includes(key as string)
                          ? cur.filter((k) => k !== key)
                          : [key as string, ...cur]
                      )
                    }
                    className={`block w-full text-left px-4 py-2 hover:bg-white/10 transition ${colorClass} ${
                      active ? "font-semibold" : ""
                    }`}
                  >
                    {key === "random"
                      ? "Zufällig"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nur mit Bildern Toggle */}
      <button
        onClick={() => setOnlyWithImages((v) => !v)}
        className={`p-2 rounded-full hover:bg-white/10 transition ${
          onlyWithImages ? "text-teal-300" : "text-white/40"
        }`}
        title="Nur mit Bildern"
      >
        <Camera size={20} />
      </button>

      {/* Ansicht wechseln */}
      <button
        onClick={() => setViewCols((v) => (v === 2 ? 1 : 2))}
        className="flex items-center space-x-1 p-2 rounded-full hover:bg-white/10 transition"
        title="Ansicht wechseln"
      >
        {[1, 2].map((i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i <= viewCols ? "bg-teal-300" : "bg-white/30"
            }`}
          />
        ))}
      </button>
    </div>
  );
}
