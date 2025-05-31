// app/challenges/[id]/ChallengeClient.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import { Challenge, Update } from "@/types/types";

// Deterministische Datumsformatierung (Deutsch):
function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const day = date.getDate();
  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}. ${month} ${year}`;
}

type ChallengeClientProps = {
  challenge: Challenge;
};

export default function ChallengeClient({ challenge }: ChallengeClientProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Modal-State: "image" oder "text"
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"image" | "text" | null>(null);
  const [modalContent, setModalContent] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const updateRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Hintergrund-Scrollen verhindern, wenn Modal offen
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  // currentIdx beim Scroll berechnen
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

  // Modal-Funktionen
  const openImageModal = (url: string) => {
    setModalType("image");
    setModalContent(url);
    setModalOpen(true);
  };
  const openTextModal = (text: string) => {
    setModalType("text");
    setModalContent(text);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalContent("");
  };

  // Professionelle Sliding-Window-Pagination (max. 8 Seiten)
  const total = challenge.updates.length;
  const currentPage = currentIdx + 1; // 1-based
  let startPage = Math.max(1, currentPage - 3);
  if (startPage + 7 > total) {
    startPage = Math.max(1, total - 7);
  }
  const endPage = Math.min(total, startPage + 7);
  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-900">
      {/* Unsichtbare Zone oben, um Mausrad-Scroll weiterzuleiten */}
      <div
        className="fixed top-0 left-0 right-0 h-2 z-40"
        onWheel={(e) => {
          scrollRef.current?.scrollBy({ top: e.deltaY, behavior: "auto" });
        }}
      />

      {/* Modal-Overlay */}
      {modalOpen && modalType === "image" && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative w-[90vw] h-[90vh]">
            <Image
              src={modalContent}
              alt="Vollbild"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
      {modalOpen && modalType === "text" && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative w-[80vw] h-[80vh] bg-white rounded-lg overflow-auto p-6">
            <p className="whitespace-pre-wrap text-gray-800">{modalContent}</p>
          </div>
        </div>
      )}

      {/* Scrollbarer Bereich: endet bei bottom-12 */}
      <div
        ref={scrollRef}
        className="absolute top-0 bottom-12 left-0 right-0 overflow-y-auto hide-scrollbar"
      >
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
              className="h-full flex items-center justify-center"
            >
              <div className="w-full h-full p-4 flex items-center justify-center">
                <UpdateSlide
                  update={update}
                  index={idx}
                  openImageModal={openImageModal}
                  openTextModal={openTextModal}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Controls mit professioneller Pagination */}
      <div className="fixed bottom-2 left-0 right-0 h-12 bg-gray-800 flex items-center justify-center space-x-4 z-50 px-4">
        <button
          onClick={goPrev}
          disabled={currentIdx === 0}
          className={`p-2 rounded-full transition ${
            currentIdx === 0 ? "text-gray-600" : "text-white hover:bg-gray-700"
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => scrollTo(p - 1)}
              className={`flex-none rounded-full w-8 h-8 flex items-center justify-center text-xs font-semibold shadow transition-transform duration-200 ${
                p - 1 === currentIdx
                  ? "bg-orange-500 text-white hover:bg-orange-600 hover:scale-110"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:scale-110"
              }`}
            >
              {p}
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
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ─────────────────────────── Funktion: UpdateSlide ───────────────────────────
// ──────────────────────────────────────────────────────────────────────────────

type UpdateSlideProps = {
  update: Update;
  index: number;
  openImageModal: (url: string) => void;
  openTextModal: (text: string) => void;
};

function UpdateSlide({
  update,
  index,
  openImageModal,
  openTextModal,
}: UpdateSlideProps) {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 0 },
    loop: false,
    mode: "snap",
  });

  const images = update.images ?? [];
  const multiple = images.length > 1;
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Wenn Folie wechselt, aktualisiere Index
  useEffect(() => {
    instanceRef.current?.on("slideChanged", (s) => {
      setCurrentImageIdx(s.track.details.rel);
    });
  }, [instanceRef]);

  // Drag-Splitter für vertikale Aufteilung
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

  const imageDuration = 1;
  const textDuration = 1.2;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg w-full h-full overflow-hidden flex">
      {/* ─── Linke Hälfte: Bild-Slider (2/3 Breite) ─────────────────────── */}
      <motion.div
        className="w-2/3 relative h-full overflow-hidden group"
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
        <div ref={sliderRef} className="keen-slider w-full h-full relative">
          {images.length > 0 ? (
            images.map((img, i) => (
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
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              kein Bild
            </div>
          )}

          {/* Große Pfeile nur bei Hover */}
          {multiple && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="hidden group-hover:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white transition"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="hidden group-hover:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white transition"
              >
                <ChevronRight size={30} />
              </button>
              {/* Fullscreen-Button oben rechts nur bei Hover */}
              <button
                onClick={() => openImageModal(images[currentImageIdx]?.url)}
                className="invisible group-hover:visible absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition"
              >
                <Maximize2 size={20} />
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* ─── Mittellinie zwischen Bild & Text ───────────────────────────── */}
      <div className="w-px bg-gray-600 opacity-50" />

      {/* ─── Rechte Hälfte: Textbereich mit draggable Splitter (1/3 Breite) ── */}
      <div
        ref={containerRef}
        className="w-1/3 flex flex-col h-full select-none relative"
      >
        {/* ─── Header: Update-Nummer + Datum + Fullscreen ───────────────── */}
        <div className="group px-6 pt-6 flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-orange-500">
              Update #{index + 1}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {formatDate(update.createdAt)}
            </p>
          </div>
          <button
            onClick={() => openTextModal(update.content || "Kein Text")}
            className="invisible group-hover:visible bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Update-Text mit Buttons unten rechts */}
        <motion.div
          className="relative overflow-auto px-6 break-words"
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
          <p className="mt-3 whitespace-pre-wrap text-lg text-gray-200">
            {update.content ?? "Kein Text"}
          </p>

          {/* Nun dezentere, aber wirkungsvolle Buttons unten rechts */}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 shadow transition transform hover:scale-105">
              <ThumbsUp size={20} className="text-red-400" />
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 shadow transition transform hover:scale-105">
              <MessageCircle size={20} className="text-blue-400" />
            </button>
          </div>
        </motion.div>

        {/* ─── Draggable Splitter ─────────────────────────────────────────── */}
        <div
          onMouseDown={() => {
            dragging.current = true;
          }}
          className="h-1 bg-gray-700 cursor-row-resize"
        />

        {/* ─── Bildbeschreibung Header + Fullscreen ──────────────────────── */}
        <div className="group px-6 pt-4 flex items-baseline justify-between">
          <h3 className="text-xl font-semibold text-gray-300">
            Bildbeschreibung:
          </h3>
          <button
            onClick={() =>
              openTextModal(
                images[currentImageIdx]?.imageText || "Keine Bildbeschreibung"
              )
            }
            className="invisible group-hover:visible bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Bildbeschreibung-Text mit Buttons unten rechts */}
        <motion.div
          className="relative overflow-auto px-6 break-words"
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
          <p className="mt-3 whitespace-pre-wrap text-gray-200">
            {images[currentImageIdx]?.imageText ?? "Keine Bildbeschreibung"}
          </p>

          {/* Nun dezentere, aber wirkungsvolle Buttons unten rechts */}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 shadow transition transform hover:scale-105">
              <ThumbsUp size={20} className="text-red-400" />
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 shadow transition transform hover:scale-105">
              <MessageCircle size={20} className="text-blue-400" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
