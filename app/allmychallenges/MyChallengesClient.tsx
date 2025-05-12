// app/allmychallenges/MyChallengesClient.tsx
"use client";

import { Challenge } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

/* ─── Fortschritts-Ring – einfarbig grün ─── */
function ProgressRing({ percent }: { percent: number }) {
  const r = 18;
  const s = 4;
  const pct = Math.min(Math.max(percent, 0), 100);
  const C = 2 * Math.PI * r;
  const off = C - (pct / 100) * C;

  return (
    <svg width={44} height={44} viewBox="0 0 44 44">
      <circle
        cx="22"
        cy="22"
        r={r}
        strokeWidth={s}
        className="fill-none stroke-white/25"
      />
      <circle
        cx="22"
        cy="22"
        r={r}
        strokeWidth={s}
        strokeDasharray={C}
        strokeDashoffset={off}
        transform="rotate(-90 22 22)"
        strokeLinecap="round"
        className="fill-none stroke-green-400"
      />
      <text
        x="22"
        y="23"
        textAnchor="middle"
        dominantBaseline="central"
        className="select-none fill-white text-[0.65rem] font-semibold"
      >
        {pct}%
      </text>
    </svg>
  );
}

/* ─── Haupt-Komponente ─── */
export default function MyChallengesClient({
  challenges,
}: {
  challenges: Challenge[];
}) {
  return (
    <section
      className="
        bg-[url('/bg1.jpg')] bg-fixed bg-cover bg-center
        py-28 px-4 text-gray-200
      "
    >
      <div className="mx-auto max-w-6xl">
        {/* Überschrift */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2
              className="
                text-4xl sm:text-5xl font-extrabold
                bg-gradient-to-r from-teal-400 to-indigo-500
                bg-clip-text text-transparent
              "
            >
              Meine Ziele
            </h2>
            <p className="text-sm text-slate-300">
              Überblick deiner laufenden Ziele
            </p>
          </div>
          <Link
            href="/create"
            className="
              rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600
              px-5 py-2 text-sm font-medium text-white shadow-sm
              transition hover:brightness-110
            "
          >
            Neues Ziel
          </Link>
        </div>

        {/* Grid */}
        {challenges.length ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((c) => {
              const pct = Math.round(c.progress ?? 0);
              const updates = c.updates?.length ?? 0;
              const img =
                c.images?.find((i) => i.isMain)?.url ??
                `https://source.unsplash.com/random/800x600?sig=${c.id}`;

              return (
                <Link
                  key={c.id}
                  href={`/allmychallenges/${c.id}`}
                  className="group block"
                >
                  <div
                    className="
                      relative flex h-[420px] flex-col overflow-hidden rounded-2xl
                      bg-white/6 backdrop-blur-md
                      border border-white/20
                      transition
                      group-hover:border-cyan-400
                      group-hover:shadow-[0_0_20px_rgba(0,255,200,0.6)]
                      group-active:border-cyan-500
                      group-active:shadow-[0_0_30px_rgba(0,255,200,0.8)]
                      group-hover:-translate-y-1
                      group-active:-translate-y-0
                      duration-300
                      cursor-pointer
                    "
                  >
                    {/* Fortschritts-Ring */}
                    <div className="absolute right-4 top-4 z-10">
                      <ProgressRing percent={pct} />
                    </div>

                    {/* Titelbild */}
                    <div className="relative h-56 w-full">
                      <Image
                        src={img}
                        alt={c.title}
                        fill
                        unoptimized
                        className="object-cover opacity-85"
                      />
                    </div>

                    {/* Inhalt */}
                    <div className="flex-grow space-y-2 p-5 text-[0.9rem] leading-snug">
                      <h2 className="line-clamp-2 font-semibold text-slate-100">
                        {c.title}
                      </h2>
                      <p className="line-clamp-2 text-slate-300">
                        {c.goal || "Kein Zieltext hinterlegt."}
                      </p>
                      <div className="space-y-1 pt-2 text-xs text-slate-400">
                        <p>Kategorie: {c.category ?? "—"}</p>
                        {c.city_address && <p>Stadt: {c.city_address}</p>}
                        <p>{updates} Updates</p>
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
