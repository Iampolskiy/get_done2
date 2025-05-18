"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Challenge } from "@/types/types";
import Image from "next/image";
import { ChevronDown, Sliders, Search, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SortKey = "progress" | "updates" | "category" | "date" | "random";

type ChallengesClientProps = {
  challenges: Challenge[];
};

export default function ChallengesClient({
  challenges,
}: ChallengesClientProps) {
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [onlyWithImages, setOnlyWithImages] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);

  // ─── sortKeys & Farbskala für Prioritäten ───────────────────────────
  const [sortKeys, setSortKeys] = useState<SortKey[]>(["date"]);
  const priorityColors = ["text-teal-300", "text-teal-200", "text-teal-100"];
  // ─────────────────────────────────────────────────────────────────────

  const [viewCols, setViewCols] = useState<1 | 2>(2);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref für Button + Dropdown
  const sortRef = useRef<HTMLDivElement>(null);

  // Scroll-to-top bei Sort-Änderung
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [sortKeys]);

  // Click-Away zum Schließen des Dropdowns **nur** bei Klick außerhalb
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortOpen &&
        sortRef.current &&
        !sortRef.current.contains(event.target as Node)
      ) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortOpen]);

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

  // ─────────── Multi-Sort mit Priorität ───────────
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
  // ────────────────────────────────────────────────────────────────

  const gridCols =
    viewCols === 1
      ? "grid-cols-1 max-w-[800px] mx-auto"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

  const cardClassesSingle =
    "relative flex flex-col overflow-hidden rounded-2xl " +
    "bg-white/10 backdrop-blur-md " +
    "border-transparent sm:border sm:border-white/20 " +
    "snap-start min-h-[82vh]";

  const cardClassesMulti =
    "relative flex flex-col overflow-hidden rounded-2xl " +
    "bg-white/10 backdrop-blur-md " +
    "border-transparent sm:border sm:border-white/20 snap-start";

  return (
    <div className="w-full px-2 sm:px-4 pt-4 overflow-x-hidden">
      {/* Toolbar */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-black/40 py-3">
        <div className="mx-auto flex flex-wrap items-center justify-center gap-2 max-w-screen-2xl px-4">
          {/* Such-Button */}
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

          {/* Sortieren (Button + Dropdown in sortRef) */}
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
                className={`ml-1 ${sortOpen ? "rotate-180" : ""} transition`}
              />
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-black/80 text-white rounded-md shadow-lg overflow-hidden z-30">
                {(
                  ["progress", "updates", "category", "date", "random"] as const
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

          {/* Nur mit Bildern */}
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

          {/* Spalten-Modus */}
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

      {/* Challenges-Grid */}
      <div
        ref={containerRef}
        className="mt-2 overflow-y-auto snap-y snap-mandatory max-h-[calc(100vh-6rem)]"
      >
        <div
          className={`grid ${gridCols} gap-6 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto pb-10`}
        >
          {sorted.map((c) => {
            const pct = Math.round(c.progress ?? 0);
            const updates = c.updates?.length ?? 0;
            const imgUrl =
              c.images?.find((i) => i.isMain)?.url ||
              `https://source.unsplash.com/random/800x600?sig=${c.id}`;

            return (
              <Link
                key={c.id}
                href={`/challenges/${c.id}`}
                className={
                  viewCols === 1 ? cardClassesSingle : cardClassesMulti
                }
              >
                <div className="relative h-72 w-full">
                  <Image
                    src={imgUrl}
                    alt={c.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <svg width={44} height={44} viewBox="0 0 44 44">
                    <circle
                      cx="22"
                      cy="22"
                      r={18}
                      strokeWidth={4}
                      className="fill-none stroke-white/25"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r={18}
                      strokeWidth={4}
                      strokeDasharray={2 * Math.PI * 18}
                      strokeDashoffset={(2 * Math.PI * 18 * (100 - pct)) / 100}
                      transform="rotate(-90 22 22)"
                      strokeLinecap="round"
                      className="fill-none stroke-teal-400"
                    />
                  </svg>
                </div>
                <div className="flex-grow p-5 flex flex-col justify-between">
                  <h2 className="text-xl font-bold text-white line-clamp-2">
                    {c.title}
                  </h2>
                  <p className="mt-1 text-sm text-white/70 line-clamp-3">
                    {c.goal || "Kein Zieltext hinterlegt."}
                  </p>
                  <div className="mt-2 text-sm text-white/60 space-y-1">
                    <div>Address: {c.city_address || "—"}</div>
                    <div>
                      Created:{" "}
                      {new Date(c.created_at || "").toLocaleDateString("de-DE")}
                    </div>
                    <div>Category: {c.category || "—"}</div>
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
