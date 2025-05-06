// app/allmychallenges/MyChallengesClient.tsx
"use client";

import { Challenge } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/* ---------- Progress‑Ring ------------------------------------ */
function ProgressRing({ percent }: { percent: number }) {
  const r = 18,
    stroke = 4,
    pct = Math.min(Math.max(percent, 0), 100),
    C = 2 * Math.PI * r,
    off = C - (pct / 100) * C;
  return (
    <svg width={44} height={44} viewBox="0 0 44 44">
      <circle
        cx="22"
        cy="22"
        r={r}
        strokeWidth={stroke}
        className="fill-none stroke-slate-700"
      />
      <circle
        cx="22"
        cy="22"
        r={r}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={off}
        transform="rotate(-90 22 22)"
        className="fill-none stroke-[url(#grad)]"
      />
      <defs>
        <linearGradient id="grad" x1="1" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <text
        x="22"
        y="23"
        textAnchor="middle"
        dominantBaseline="central"
        className="select-none fill-slate-200 text-[0.65rem] font-semibold"
      >
        {pct}%
      </text>
    </svg>
  );
}

/* ---------- Haupt‑Komponente --------------------------------- */
type Props = { challenges: Challenge[] };

export default function MyChallengesClient({ challenges }: Props) {
  return (
    <section className="min-h-screen bg-neutral-900 px-6 py-12 text-gray-200">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-4xl font-extrabold text-transparent">
              Meine Ziele
            </h1>
            <p className="text-sm text-slate-400">
              Eine Übersicht deiner laufenden Ziele
            </p>
          </div>
          <Link
            href="/create"
            className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-2 font-medium text-white shadow transition hover:brightness-110"
          >
            Neues Ziel
          </Link>
        </div>

        {/* Grid */}
        {challenges.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((ch) => {
              const cover = (ch.images ?? []).find((i) => i.isMain);
              const pct = Math.round(ch.progress ?? 0);

              const glow = [
                "from-cyan-400 via-sky-500 to-blue-500",
                "from-pink-500 via-rose-500 to-orange-400",
                "from-green-400 via-emerald-400 to-lime-400",
                "from-purple-500 via-violet-500 to-indigo-500",
                "from-amber-400 via-yellow-400 to-orange-500",
                "from-teal-400 via-cyan-400 to-sky-400",
              ][ch.id % 6];

              return (
                <Link
                  key={ch.id}
                  href={`/allmychallenges/${ch.id}`}
                  className="group relative rounded-2xl p-[2px] outline-none"
                >
                  {/* statischer Glow‑Border – auf Hover etwas kräftiger */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${glow}
                      opacity-60 blur-md
                      transition
                      group-hover:opacity-90 group-focus:opacity-90
                      group-hover:shadow-[0_0_12px_4px_rgba(0,0,0,0.45)]
                      group-focus:shadow-[0_0_12px_4px_rgba(0,0,0,0.45)]`}
                  />

                  {/* Card‑Body */}
                  <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-800 shadow-lg transition-shadow group-hover:shadow-xl">
                    {/* Bild */}
                    {cover ? (
                      <div className="relative h-44 w-full">
                        <Image
                          src={cover.url}
                          alt={ch.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-neutral-700 text-sm text-slate-400">
                        Kein Bild
                      </div>
                    )}

                    {/* Inhalt */}
                    <div className="flex-grow p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <h2 className="mr-2 text-lg font-semibold leading-snug">
                          {ch.title}
                        </h2>
                        <ProgressRing percent={pct} />
                      </div>

                      <span
                        className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          ch.completed
                            ? "bg-emerald-600/20 text-emerald-400"
                            : "bg-cyan-600/20 text-cyan-400"
                        }`}
                      >
                        {ch.completed ? "Abgeschlossen" : "In Bearbeitung"}
                      </span>

                      <p className="line-clamp-2 text-sm text-slate-300">
                        {ch.goal || "Kein Zieltext hinterlegt."}
                      </p>

                      <div className="mt-4 space-y-1 text-xs text-slate-400">
                        <p>
                          <span className="text-slate-500">Kategorie:</span>{" "}
                          {ch.category || "—"}
                        </p>
                        <p>
                          <span className="text-slate-500">Dauer:</span>{" "}
                          {ch.duration ?? "—"} Tage
                        </p>
                        <p>
                          <span className="text-slate-500">Schwierigkeit:</span>{" "}
                          {ch.difficulty || "—"}
                        </p>
                        <p>
                          <span className="text-slate-500">Erstellt:</span>{" "}
                          {ch.created_at?.toLocaleDateString("de-DE")}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-slate-400">Keine Ziele gefunden.</p>
        )}
      </div>
    </section>
  );
}
