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

  // currentIdx per Scroll berechnen
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const st = el.scrollTop,
        vh = el.clientHeight;
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
      {/* Rechte Hover-Zone für Timeline */}
      {!showTimeline && (
        <div
          className="absolute top-0 right-0 h-full w-12 z-20"
          onMouseEnter={() => setShowTimeline(true)}
        />
      )}

      {/* Timeline rechts */}
      {showTimeline && (
        <aside
          className="absolute top-0 right-0 h-full w-20 flex flex-col items-center pt-16 z-40"
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
                rounded-full w-10 h-10 flex items-center justify-center
                text-sm font-semibold shadow cursor-pointer
                transition-transform duration-200
                ${
                  i === currentIdx
                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:scale-110"
                    : "bg-gray-800 text-gray-200 hover:bg-gray-700 hover:scale-110"
                }
              `}
            >
              {i + 1}
            </button>
          ))}
        </aside>
      )}

      {/* Scrollbarer Bereich mit allen Updates */}
      <div ref={scrollRef} className="h-full overflow-y-auto hide-scrollbar">
        {challenge.updates.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Noch keine Updates vorhanden.
          </div>
        ) : (
          challenge.updates.map((update, idx) => (
            <div
              key={update.id}
              ref={(el) => {
                updateRefs.current[idx] = el;
              }}
              className="h-[calc(100vh-4rem)] flex border-b border-gray-700"
            >
              <UpdateSlide update={update} />
            </div>
          ))
        )}
      </div>

      {/* ─── Control Area unten ─────────────────────────────────────────── */}
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
                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:scale-110"
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

function UpdateSlide({ update }: { update: Update }) {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 0 },
    loop: false,
    mode: "snap",
  });

  const images = update.images ?? [];
  const multiple = images.length > 1;
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // State für vertikale Aufteilung (Prozent des UpdateTexts oben)
  const [topPct, setTopPct] = useState(66);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Slide-Change-Event für imageText
  useEffect(() => {
    instanceRef.current?.on("slideChanged", (s) => {
      setCurrentImageIdx(s.track.details.rel);
    });
  }, [instanceRef]);

  // Mousemove / Mouseup global für Drag
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

  const imageDuration = 1; // 1 Sekunde
  const textDuration = 1.2; // 1.2 Sekunden

  return (
    <>
      {/* ─── Left: Bild-Slider ─────────────────────────────────────────── */}
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

        {/* Pfeile unter dem Slider */}
        {multiple && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-10">
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

      {/* ─── Mittellinie ───────────────────────────────────────────────── */}
      <div className="w-px bg-gray-600 opacity-50" />

      {/* ─── Right: Text-Bereich mit draggable Splitter ──────────────── */}
      <div
        ref={containerRef}
        className="w-1/3 flex flex-col h-full select-none"
      >
        {/* Update-Text oben */}
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

        {/* Draggable Splitter */}
        <div
          onMouseDown={() => {
            dragging.current = true;
          }}
          className="h-1 bg-gray-600 cursor-row-resize"
        />

        {/* Image-Text unten */}
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
    </>
  );
}
