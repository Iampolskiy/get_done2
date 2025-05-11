"use client";

/* import { useId } from "react";
 */ import { Challenge } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

/* ─────────── Fortschritts-Ring ─────────── */
/* ─────────── Fortschritts-Ring (zweilagig) ─────────── */
function ProgressRing({ percent }: { percent: number }) {
  const r = 18; // Radius
  const w = 4; // sichtbare Strich-Breite
  const pct = Math.max(0, Math.min(percent, 100));
  const C = 2 * Math.PI * r;
  const off = C - (pct / 100) * C;

  return (
    <svg width={44} height={44} viewBox="0 0 44 44">
      {/* blasser Hintergrund-Ring */}
      <circle
        cx="22"
        cy="22"
        r={r}
        strokeWidth={w}
        className="fill-none stroke-white/25"
      />

      {/* ① dunkler Außen-Schatten (etwas breiter) */}
      <circle
        cx="22"
        cy="22"
        r={r}
        strokeWidth={w + 2} // +2 px
        strokeDasharray={C}
        strokeDashoffset={off}
        transform="rotate(-90 22 22)"
        strokeLinecap="round"
        className="fill-none stroke-[#0b4d1c]"
      />

      {/* ② eigentlicher Fortschritts-Strich (hell-grün) */}
      <circle
        cx="22"
        cy="22"
        r={r}
        strokeWidth={w}
        strokeDasharray={C}
        strokeDashoffset={off}
        transform="rotate(-90 22 22)"
        strokeLinecap="round"
        className="fill-none stroke-[#25d366]"
      />

      {/* Prozent-Label */}
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

/* ─────────── Haupt-Komponente ─────────── */
export default function MyChallengesClient({
  challenges,
}: {
  challenges: Challenge[];
}) {
  return (
    <section className="min-h-screen bg-[url('/bg6.jpg')] bg-cover bg-center py-12 px-4 text-gray-200">
      <div className="mx-auto max-w-6xl">
        {/* ── Header ── */}
        <header className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
              Meine&nbsp;Ziele
            </h1>
            <p className="text-sm text-slate-300">
              Überblick deiner laufenden Ziele!!!
            </p>
          </div>

          <Link
            href="/create"
            className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
          >
            Neues&nbsp;Ziel
          </Link>
        </header>

        {/* ── Grid ── */}
        {challenges.length ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((c) => {
              const pct = Math.round(c.progress ?? 0);
              const updates = c.updates?.length ?? 0;
              const img = //sdsd
                c.images?.find((i) => i.isMain)?.url ??
                `https://source.unsplash.com/random/800x600?sig=${c.id}`;

              return (
                <Link
                  key={c.id}
                  href={`/allmychallenges/${c.id}`}
                  className="block"
                >
                  {/* feiner Border */}
                  <div className="rounded-2xl border border-white/15 p-[1px]">
                    {/* Milchglas-Card */}
                    <div className="relative flex h-[420px] flex-col overflow-hidden rounded-[inherit] bg-transparent backdrop-blur-md shadow">
                      {/* Fortschritts-Ring */}
                      <div className="absolute right-4 top-4 z-10">
                        <ProgressRing percent={pct} />
                      </div>

                      {/* Titelbild */}
                      <div className="relative h-56 w-full">
                        <Image
                          src={img}
                          alt=""
                          fill
                          className="object-cover opacity-85"
                          unoptimized
                        />
                      </div>

                      {/* Inhalte */}
                      <div className="flex-grow space-y-2 p-5 text-[0.9rem] leading-snug">
                        <h2 className="font-semibold text-slate-100 line-clamp-2">
                          {c.title}
                        </h2>

                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                            c.completed
                              ? "bg-emerald-600/30 text-emerald-200"
                              : "bg-cyan-600/30 text-cyan-200"
                          }`}
                        >
                          {c.completed ? "Abgeschlossen" : "In Bearbeitung"}
                        </span>

                        <p className="line-clamp-2 text-slate-300">
                          {c.goal || "Kein Zieltext hinterlegt."}
                        </p>

                        <div className="pt-2 space-y-1 text-xs text-slate-400">
                          <p>Kategorie: {c.category ?? "—"}</p>
                          {c.city_address && <p>Stadt: {c.city_address}</p>}
                          <p>{updates} Updates</p>
                        </div>
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
