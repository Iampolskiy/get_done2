"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Challenge } from "@/types/types";
import { ChevronDown, Sliders, Search, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SortKey = "progress" | "updates" | "category" | "date" | "random";

interface ChallengesClientProps {
  challenges: Challenge[];
}

// Helper: formatiert Datum+Uhrzeit stets in de-DE, verhindert Hydration-Fehler
function formatGermanDateTime(iso?: string | Date | null): string {
  if (!iso) return "—";
  const d = iso instanceof Date ? iso : new Date(iso);
  const date = d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${date}, ${time}`;
}

export default function ChallengesClient({
  challenges,
}: ChallengesClientProps) {
  // Toolbar state
  const [query, setQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [onlyWithImages, setOnlyWithImages] = useState<boolean>(true);
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [sortKeys, setSortKeys] = useState<SortKey[]>(["date"]);
  const [viewCols, setViewCols] = useState<1 | 2>(2);

  // Refs & helpers
  const containerRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const priorityColors = ["text-teal-300", "text-teal-200", "text-teal-100"];

  // Scroll to top when sort changes
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [sortKeys]);

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

  // Filter by search
  const bySearch = useMemo(() => {
    return challenges.filter((c) =>
      c.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [challenges, query]);

  // Filter by image presence
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

  // Grid layout classes
  const gridColsClass =
    viewCols === 1
      ? "max-w-[780px] mx-auto grid-cols-1"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

  // Card base classes
  const cardClasses =
    "relative flex flex-col overflow-hidden rounded-2xl " +
    "bg-white/10 backdrop-blur-md border-transparent sm:border sm:border-white/20 " +
    "snap-start shadow-sm hover:border-teal-300 hover:shadow-[0_0_20px_rgba(14,211,181,0.5)] transition";

  return (
    <div className="w-full px-2 sm:px-4 pt-4 overflow-x-hidden">
      {/* Toolbar */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-black/40 py-3">
        <div className="mx-auto flex flex-wrap items-center justify-center gap-2 max-w-screen-2xl px-4">
          {/* Search Toggle */}
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
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setShowSearch(false);
                    }
                  }}
                  autoFocus
                  className="w-full rounded-full bg-white/10 placeholder-white/50 text-white px-4 py-2 pl-10 focus:outline-none"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                  <Search size={16} />
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sort Toggle */}
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
                  [
                    "progress",
                    "updates",
                    "category",
                    "date",
                    "random",
                  ] as SortKey[]
                ).map((key) => {
                  const pos = sortKeys.indexOf(key);
                  const isActive = pos !== -1;
                  const colorClass = isActive
                    ? priorityColors[Math.min(pos, priorityColors.length - 1)]
                    : "text-white";
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        setSortKeys((current) =>
                          current.includes(key)
                            ? current.filter((k) => k !== key)
                            : [key, ...current]
                        )
                      }
                      className={`block w-full text-left px-4 py-2 transition ${colorClass} ${
                        isActive ? "font-bold" : ""
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

          {/* Only With Images */}
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

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={() => setViewCols(viewCols === 1 ? 2 : 1)}
              className="flex items-center space-x-1 p-2 rounded transition"
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
        </div>
      </div>

      {/* Challenges Grid */}
      <div
        ref={containerRef}
        className="mt-2 overflow-y-auto snap-y snap-mandatory max-h-[calc(100vh-6rem)]"
      >
        <div
          className={`grid ${gridColsClass} gap-6 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto pb-10`}
        >
          {sorted.map((c) => {
            const updates = c.updates?.length ?? 0;
            const imgUrl = c.images?.find((i) => i.isMain)?.url;

            return (
              <Link
                key={c.id}
                href={`/challenges/${c.id}`}
                className={cardClasses}
              >
                {/* Image or Placeholder */}
                <div className="relative h-72 w-full bg-gray-800">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
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

                {/* Progress Ring */}
                <div className="absolute top-4 right-4 z-10 w-12 h-12">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14B8A6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      strokeWidth="10"
                      fill="none"
                      className="stroke-white/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      strokeWidth="10"
                      fill="none"
                      stroke="url(#grad)"
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={
                        (2 * Math.PI * 45 * (100 - (c.progress ?? 0))) / 100
                      }
                      transform="rotate(-90 50 50)"
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <text
                      x="50"
                      y="54"
                      textAnchor="middle"
                      className="text-xl font-bold text-white"
                    >
                      {Math.round(c.progress ?? 0)}%
                    </text>
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-grow p-5 flex flex-col justify-between">
                  <h2 className="text-xl font-bold text-white line-clamp-2">
                    {c.title}
                  </h2>

                  {/* USERRR */}
                  {c.author && (
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-sm text-white/70">
                        {c.author.name}
                      </span>
                      <span className="text-sm text-white/70">
                        {c.authorId}
                      </span>
                      <span className="text-sm text-white/70">
                        {c.author.email}
                      </span>
                    </div>
                  )}

                  <div className="mt-2 text-sm text-white/60">
                    Created: {formatGermanDateTime(c.created_at)}
                  </div>
                  <div className="mt-2 text-sm text-white/60">
                    Dauer: {c.duration}
                  </div>
                  <p className="mt-1 text-sm text-white/70 line-clamp-3">
                    {c.goal || "Kein Zieltext hinterlegt."}
                  </p>
                  <div className="mt-2 text-sm text-white/60 space-y-1">
                    <div>Address: {c.city_address || ""}</div>
                    <div>Category: {c.category || ""}</div>
                    <div>
                      {updates} {updates === 1 ? "Update" : "Updates"}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
