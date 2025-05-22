"use client";

import { useFilter } from "@/app/context/FilterContext";
import { useRouter } from "next/navigation";
import { Sliders, Camera, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

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
  const formRef = useRef<HTMLFormElement>(null);

  const sortOptions = [
    "progress",
    "updates",
    "category",
    "date",
    "random",
  ] as const;
  const priorityColors = ["text-teal-300", "text-teal-200", "text-teal-100"];

  // Close sort dropdown on outside click
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

  // Close search input on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
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
  }, [showSearch]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowSearch(false);
    router.push(`/challenges?search=${encodeURIComponent(search)}`);
  }

  return (
    <div className="relative flex items-center gap-2">
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

      {/* Search Input: immer mittig als Overlay */}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
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
                          : ([key as string, ...cur] as string[])
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

      {/* Only with images */}
      <button
        onClick={() => setOnlyWithImages((v) => !v)}
        className={`p-2 rounded-full hover:bg-white/10 transition ${
          onlyWithImages ? "text-teal-300" : "text-white/40"
        }`}
        title="Nur mit Bildern"
      >
        <Camera size={20} />
      </button>

      {/* View mode */}
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
