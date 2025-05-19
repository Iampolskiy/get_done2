"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Challenge } from "@/types/types";
import { formatGermanDateTime } from "@/lib/date";
import { Search, Sliders, Camera, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MyChallengesClient({
  challenges,
}: {
  challenges: Challenge[];
}) {
  // Toolbar state
  const [query, setQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [onlyWithImages, setOnlyWithImages] = useState<boolean>(true);
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [sortKeys, setSortKeys] = useState<
    ("progress" | "updates" | "category" | "date" | "random")[]
  >(["date"]);
  const [viewCols, setViewCols] = useState<1 | 2>(2);

  const containerRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const priorityColors = ["text-teal-300", "text-teal-200", "text-teal-100"];

  // Scroll to top when sorting/filtering
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [query, onlyWithImages, sortKeys, viewCols]);

  // Close sort dropdown when clicking outside
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

  // Filter by search & image presence
  const bySearch = useMemo(
    () =>
      challenges.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase())
      ),
    [challenges, query]
  );
  const filtered = onlyWithImages
    ? bySearch.filter((c) => (c.images?.length ?? 0) > 0)
    : bySearch;

  // Multi-key sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      for (const key of sortKeys) {
        let diff = 0;
        switch (key) {
          case "progress":
            diff = (b.progress ?? 0) - (a.progress ?? 0);
            break;
          case "updates":
            diff = (b.updates?.length ?? 0) - (a.updates?.length ?? 0);
            break;
          case "category":
            diff = (a.category ?? "").localeCompare(b.category ?? "");
            break;
          case "date":
            diff =
              new Date(b.created_at ?? "").getTime() -
              new Date(a.created_at ?? "").getTime();
            break;
          case "random":
            diff = Math.random() < 0.5 ? -1 : 1;
            break;
        }
        if (diff !== 0) return diff;
      }
      return 0;
    });
  }, [filtered, sortKeys]);

  const gridColsClass =
    viewCols === 1
      ? "max-w-[780px] mx-auto grid-cols-1"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

  const cardClasses =
    "relative flex flex-col overflow-hidden rounded-2xl " +
    "bg-white/10 backdrop-blur-md border-transparent sm:border sm:border-white/20 " +
    "snap-start shadow-sm hover:border-teal-300 hover:shadow-[0_0_20px_rgba(14,211,181,0.5)] transition";

  return (
    <div className="w-full px-2 sm:px-4 pt-4 overflow-x-hidden">
      {/* Toolbar */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-black/40 py-3">
        <div className="mx-auto flex flex-wrap items-center justify-center gap-2 max-w-screen-2xl px-4">
          {/* Search */}
          <button
            onClick={() => setShowSearch((v) => !v)}
            className={`p-2 rounded-full hover:bg-white/10 transition ${
              query ? "text-teal-300" : "text-white"
            }`}
            title="Suche"
          >
            <Search size={20} />
          </button>
          <AnimatePresence>
            {showSearch && (
              <motion.div
                key="search-input"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 140, opacity: 1, marginLeft: 8 }}
                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Suche…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="w-full rounded-full bg-white/10 placeholder-white/50 text-white px-4 py-2 pl-10 focus:outline-none"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                  <Search size={16} />
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sort */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className={`p-2 rounded-full hover:bg-white/10 transition flex items-center ${
                sortKeys.length > 0 ? "text-teal-300" : "text-white"
              }`}
              title="Sortieren"
            >
              <Sliders size={20} />
              <ChevronDown
                size={16}
                className={`ml-1 transition ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-black/80 text-white rounded-md shadow-lg overflow-hidden z-30">
                {(
                  ["progress", "updates", "category", "date", "random"] as const
                ).map((key) => {
                  const pos = sortKeys.indexOf(key);
                  const active = pos !== -1;
                  const color = active
                    ? priorityColors[Math.min(pos, priorityColors.length - 1)]
                    : "text-white";
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        setSortKeys((cur) =>
                          cur.includes(key)
                            ? cur.filter((k) => k !== key)
                            : [key, ...cur]
                        )
                      }
                      className={`block w-full text-left px-4 py-2 transition ${color} ${
                        active ? "font-bold" : ""
                      }`}
                    >
                      {key === "random"
                        ? "Zufällig"
                        : key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Only with images */}
          <button
            onClick={() => setOnlyWithImages((v) => !v)}
            className="text-white p-2 rounded-full hover:bg-white/10 transition"
            title="Nur mit Bildern"
          >
            <Camera
              size={20}
              className={`transition ${
                onlyWithImages ? "text-teal-300" : "text-white/40"
              }`}
            />
          </button>

          {/* View mode */}
          <button
            onClick={() => setViewCols((v) => (v === 1 ? 2 : 1))}
            className="flex items-center space-x-1 p-2 rounded transition"
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
      </div>

      {/* Grid */}
      <div
        ref={containerRef}
        className={`
          grid gap-6 px-4 sm:px-6 lg:px-8 mx-auto pb-10
          ${gridColsClass}
          max-w-screen-2xl
        `}
      >
        {sorted.length > 0 ? (
          sorted.map((c) => {
            const updates = c.updates?.length ?? 0;
            const img = c.images?.find((i) => i.isMain)?.url;
            return (
              <Link
                key={c.id}
                href={`/allmychallenges/${c.id}`}
                className={cardClasses}
              >
                {/* Image or placeholder */}
                <div className="relative h-56 w-full bg-gray-800">
                  {img ? (
                    <Image
                      src={img}
                      alt={c.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/50">
                      Kein Bild
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow p-5 flex flex-col justify-between">
                  <h3 className="text-lg font-bold text-white line-clamp-2">
                    {c.title}
                  </h3>
                  <div className="mt-2 text-sm text-white/60">
                    Erstellt: {formatGermanDateTime(c.created_at)}
                  </div>
                  <p className="mt-1 text-sm text-white/70 line-clamp-3">
                    {c.goal || "Kein Zieltext hinterlegt."}
                  </p>
                  <div className="mt-3 text-sm text-white/60 space-y-1">
                    <div>Kategorie: {c.category || "—"}</div>
                    <div>
                      {updates} {updates === 1 ? "Update" : "Updates"}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="col-span-full text-center text-white/70 py-10">
            Keine Ziele gefunden.
          </p>
        )}
      </div>
    </div>
  );
}
