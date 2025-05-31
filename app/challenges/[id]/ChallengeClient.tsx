// app/challenges/[id]/ChallengeClient.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Challenge, Update } from "@/types/types";

type ChallengeClientProps = {
  challenge: Challenge;
};

export default function ChallengeClient({ challenge }: ChallengeClientProps) {
  const [showTimeline, setShowTimeline] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const updateRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ─── Berechnung currentIdx beim Scroll ───────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const st = el.scrollTop;
      const vh = el.clientHeight;
      let idx = 0;
      updateRefs.current.forEach((ref, i) => {
        if (ref && ref.offsetTop <= st + vh / 2) idx = i;
      });
      setCurrentIdx(idx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i: number) =>
    updateRefs.current[i]?.scrollIntoView({ behavior: "smooth" });

  const goPrev = () => {
    if (currentIdx > 0) scrollTo(currentIdx - 1);
  };
  const goNext = () => {
    if (currentIdx < challenge.updates.length - 1) scrollTo(currentIdx + 1);
  };

  return (
    <section className="relative h-[calc(100vh-4rem)] bg-gray-900 text-gray-100">
      {/* ─── Unsichtbare Zone rechts, um Timeline einzublenden ─────────── */}
      {!showTimeline && (
        <div
          className="absolute top-0 right-0 h-full w-8 z-20"
          onMouseEnter={() => setShowTimeline(true)}
        />
      )}

      {/* ─── Timeline‐Buttons (sichtbar, wenn showTimeline) ─────────────── */}
      {showTimeline && (
        <aside
          className="absolute top-0 right-0 h-full w-16 flex flex-col items-center pt-16 z-30"
          onMouseEnter={() => setShowTimeline(true)}
          onMouseLeave={() => setShowTimeline(false)}
        >
          <div className="w-1 bg-gray-600 h-full rounded opacity-50" />
          {challenge.updates.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              style={{
                top: `${((i + 1) * 100) / (challenge.updates.length + 1)}%`,
              }}
              className={`
                absolute left-1/2 -translate-x-1/2
                w-10 h-10 rounded-full flex items-center justify-center
                text-sm font-semibold shadow-lg cursor-pointer
                transition-transform duration-200
                ${
                  i === currentIdx
                    ? "bg-orange-500 text-white hover:bg-orange-600 hover:scale-110"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-110"
                }
              `}
            >
              {i + 1}
            </button>
          ))}
        </aside>
      )}

      {/* ─── Scrollbarer Bereich mit jedem Update in voller Slide‐Höhe ───── */}
      <div ref={scrollRef} className="h-full overflow-y-auto hide-scrollbar">
        {challenge.updates.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8 text-gray-400">
            Noch keine Updates vorhanden.
          </div>
        ) : (
          challenge.updates.map((update, idx) => (
            <div
              key={update.id}
              ref={(el) => {
                updateRefs.current[idx] = el;
              }}
              className="h-[calc(100vh-4rem)] flex items-center justify-center border-b border-gray-700 last:border-b-0"
            >
              {/* ─── Jedes Update als Card, die die volle Slide‐Größe hat ─── */}
              <div className="w-full h-full p-4 flex items-center justify-center">
                <UpdateSlide update={update} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─── Control Area unten: Prev/Next + Pagination Buttons ─────────── */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-800 flex items-center justify-center space-x-6 z-50">
        <button
          onClick={goPrev}
          disabled={currentIdx === 0}
          className={`p-2 rounded-full transition ${
            currentIdx === 0 ? "text-gray-600" : "text-white hover:bg-gray-700"
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar px-4">
          {challenge.updates.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`flex-none rounded-full w-8 h-8 flex items-center justify-center text-xs font-semibold shadow transition-transform duration-200 ${
                i === currentIdx
                  ? "bg-orange-500 text-white hover:bg-orange-600 hover:scale-110"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:scale-110"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentIdx === challenge.updates.length - 1}
          className={`p-2 rounded-full transition ${
            currentIdx === challenge.updates.length - 1
              ? "text-gray-600"
              : "text-white hover:bg-gray-700"
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ─────────────────────────── Funktion: UpdateSlide ───────────────────────────
// ──────────────────────────────────────────────────────────────────────────────

function UpdateSlide({ update }: { update: Update }) {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 0 },
    loop: false,
    mode: "snap",
  });

  const images = update.images ?? [];
  const multiple = images.length > 1;
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Wenn sich der Slide ändert, merken wir uns den Index
  useEffect(() => {
    instanceRef.current?.on("slideChanged", (s) => {
      setCurrentImageIdx(s.track.details.rel);
    });
  }, [instanceRef]);

  // ─── Drag & Drop Splitter für vertikale Aufteilung ───────────────────
  const [topPct, setTopPct] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      let pct = (relY / rect.height) * 100;
      if (pct < 10) pct = 10;
      if (pct > 90) pct = 90;
      setTopPct(pct);
    };
    const onMouseUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const imageDuration = 1; // Dauer der Bild‐Transition
  const textDuration = 1.2; // Dauer der Text‐Transition

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg w-full h-full overflow-hidden flex">
      {/* ─── Left: Bild‐Slider (2/3 der Card‐Breite) ─────────────────────── */}
      <motion.div
        className="w-2/3 relative h-full overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: imageDuration,
          type: "spring",
          stiffness: 200,
          damping: 30,
        }}
      >
        {images.length > 0 ? (
          <div ref={sliderRef} className="keen-slider w-full h-full">
            {images.map((img, i) => (
              <div
                key={i}
                className="keen-slider__slide relative w-full h-full"
              >
                <Image
                  src={img.url}
                  alt={`Update-Bild ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            kein Bild
          </div>
        )}

        {/* ─── Pfeile unter dem Slider (nur bei mehreren Bildern) ───────── */}
        {multiple && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            <button
              onClick={() => instanceRef.current?.prev()}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </motion.div>

      {/* ─── Mittellinie zwischen Bild & Text ───────────────────────────── */}
      <div className="w-px bg-gray-600 opacity-50" />

      {/* ─── Right: Textbereich mit draggable Splitter (1/3 der Card) ───── */}
      <div
        ref={containerRef}
        className="w-1/3 flex flex-col h-full select-none"
      >
        {/* ─── Überschrift & Akzentlinie ──────────────────────────────── */}
        <div className="px-6 pt-6">
          <h2 className="text-2xl font-semibold text-orange-500">
            Recent Update
          </h2>
          <div className="h-px bg-orange-500 opacity-80 my-2" />
        </div>

        {/* ─── Update‐Text oben (Höhe = topPct%) ───────────────────────── */}
        <motion.div
          className="overflow-auto px-6"
          style={{ height: `${topPct}%` }}
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: textDuration,
            type: "spring",
            stiffness: 200,
            damping: 30,
          }}
        >
          <p className="whitespace-pre-wrap text-lg text-gray-200">
            {update.content ?? "Kein Text"}
          </p>
        </motion.div>

        {/* ─── Draggable Splitter (horizontale Linie) ──────────────────── */}
        <div
          onMouseDown={() => {
            dragging.current = true;
          }}
          className="h-1 bg-gray-700 cursor-row-resize"
        />

        {/* ─── Zwischenlinie + „Image Text“ Überschrift ────────────────── */}
        <div className="px-6 pt-4">
          <div className="h-px bg-gray-600 opacity-50 mb-2" />
          <h3 className="text-xl font-semibold text-gray-300">Image Text</h3>
        </div>

        {/* ─── Image‐Text unten (Höhe = 100-topPct%) ────────────────────── */}
        <motion.div
          className="overflow-auto px-6"
          style={{ height: `${100 - topPct}%` }}
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: textDuration,
            type: "spring",
            stiffness: 200,
            damping: 30,
          }}
        >
          <p className="whitespace-pre-wrap text-gray-200">
            {images[currentImageIdx]?.imageText ?? "Keine Bildbeschreibung"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
