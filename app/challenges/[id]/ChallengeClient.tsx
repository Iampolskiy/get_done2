// app/challenges/[id]/ChallengeClient.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import { Challenge, Update } from "@/types/types";
/* import { GlobeWithSearch } from "@/components/GlobeWithSearch"; */

// Deterministische Datumsformatierung (Deutsch)
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

  // Verhindert Scroll im Hintergrund, wenn Modal offen ist
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
    const total = challenge?.updates?.length ?? 0;
    if (currentIdx < total - 1) scrollTo(currentIdx + 1);
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

  // ─── Pagination: max. 8 Seiten ────────────────────────────────────
  const total = challenge?.updates?.length ?? 0;
  const currentPage = currentIdx + 1; // 1-basierter Index
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
    <div className="h-screen overflow-hidden bg-black">
      {/* Unsichtbare Zone oben, um Mausrad-Scroll ans Scroll-Container weiterzugeben */}
      <div
        className="fixed top-0 left-0 right-0 h-2 z-40"
        onWheel={(e) => {
          scrollRef.current?.scrollBy({ top: e.deltaY, behavior: "auto" });
        }}
      />
      {/* <GlobeWithSearch /> */}

      {/* Modal-Overlay */}
      <AnimatePresence>
        {modalOpen && modalType === "image" && (
          <motion.div
            key="image-modal"
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-[90vw] h-[90vh] bg-black bg-opacity-30 backdrop-blur-md rounded-lg overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={closeModal} // Klick schließt Modal
            >
              <Image
                src={modalContent}
                alt="Vollbild-Bild"
                fill
                className="object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}

        {modalOpen && modalType === "text" && (
          <motion.div
            key="text-modal"
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-[80vw] h-[80vh] bg-black rounded-lg overflow-auto p-8 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                {modalContent}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollbarer Bereich: endet direkt über den Bottom Controls */}
      <div
        ref={scrollRef}
        className="absolute top-0 bottom-12 left-0 right-0 overflow-y-auto hide-scrollbar"
      >
        {total === 0 ? (
          <div className="flex items-center justify-center h-full p-8 text-gray-500">
            Noch keine Updates vorhanden.
          </div>
        ) : (
          challenge.updates.map((update, idx) => (
            <div
              key={update.id}
              ref={(el) => {
                updateRefs.current[idx] = el;
              }}
              className="h-[calc(100vh-3rem)] flex items-center justify-center px-4 py-6"
            >
              <div className="w-full h-full p-4">
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

      {/* Bottom Controls mit Pagination */}
      <div className="fixed bottom-2 left-0 right-0 h-12 bg-black bg-opacity-90 flex items-center justify-center space-x-4 z-50 px-4">
        <motion.button
          onClick={goPrev}
          disabled={currentIdx === 0}
          whileHover={currentIdx !== 0 ? { scale: 1.1 } : {}}
          className={`p-2 rounded-full transition ${
            currentIdx === 0 ? "text-gray-600" : "text-white hover:bg-gray-700"
          }`}
        >
          <ChevronLeft size={24} />
        </motion.button>

        <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
          {pages.map((p) => (
            <motion.button
              key={p}
              onClick={() => scrollTo(p - 1)}
              whileHover={{ scale: 1.1 }}
              className={`flex-none rounded-full w-8 h-8 flex items-center justify-center text-xs font-semibold shadow transition-transform duration-200 ${
                p - 1 === currentIdx
                  ? "bg-white text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {p}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={goNext}
          disabled={currentIdx === total - 1}
          whileHover={currentIdx !== total - 1 ? { scale: 1.1 } : {}}
          className={`p-2 rounded-full transition ${
            currentIdx === total - 1
              ? "text-gray-600"
              : "text-white hover:bg-gray-700"
          }`}
        >
          <ChevronRight size={24} />
        </motion.button>
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
  // State für aktuellen Bild-Index
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Keen-Slider initialisieren mit loop: true
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 0 },
    loop: true,
    mode: "snap",
    slideChanged(s) {
      setCurrentImageIdx(s.track.details.rel);
    },
  });

  const images = update.images ?? [];
  const multiple = images.length > 1; // Arrows nur anzeigen, wenn ≥2 Bilder

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
    <motion.div
      className="rounded-2xl shadow-2xl w-full h-full overflow-hidden flex transform hover:scale-[1.015] transition-transform duration-300"
      style={{ backgroundColor: "#0a0a0a" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
    >
      {/* Linke Hälfte: Bild-Container (w-2/3) */}
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
        <div
          ref={sliderRef}
          className="keen-slider w-full h-full relative overflow-hidden"
        >
          {images.length > 0 ? (
            images.map((img, i) => (
              <div
                key={i}
                className="keen-slider__slide relative w-full h-full group overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt={`Update-Bild ${i + 1}`}
                  fill
                  className="object-cover rounded-2xl"
                />
                {/* Fullscreen-Button pro Slide */}
                {multiple && (
                  <motion.button
                    onClick={() => openImageModal(img.url)}
                    className="
                      absolute top-2 right-2 
                      bg-gray-700 bg-opacity-70 
                      hover:bg-gray-600 
                      text-white 
                      rounded-full p-1 shadow-lg 
                      opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 ease-in-out
                      transition-transform transform hover:scale-110
                    "
                  >
                    <Maximize2 size={18} />
                  </motion.button>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              kein Bild
            </div>
          )}

          {/* Große Pfeile nur bei ≥ 2 Bildern */}
          {multiple && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="
                  hidden group-hover:flex 
                  absolute left-4 top-1/2 transform -translate-y-1/2 
                  bg-black bg-opacity-60 rounded-full p-3 text-white 
                  transition-opacity duration-300 ease-in-out
                  transition-transform transform hover:scale-110
                "
              >
                <ChevronLeft size={30} />
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="
                  hidden group-hover:flex 
                  absolute right-4 top-1/2 transform -translate-y-1/2 
                  bg-black bg-opacity-60 rounded-full p-3 text-white 
                  transition-opacity duration-300 ease-in-out
                  transition-transform transform hover:scale-110
                "
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Gap + vertikale Linie */}
      <div className="w-6 flex justify-center bg-black">
        <div className="h-full w-px bg-gray-700 opacity-50" />
      </div>

      {/* Rechte Hälfte: Textbereich (w-1/3) */}
      <motion.div
        ref={containerRef}
        className="w-1/3 flex flex-col h-full select-none bg-black"
      >
        {/* Header: Update-Nummer + Datum + Fullscreen */}
        <div className="group px-6 pt-6 flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white drop-shadow-lg">
              Update #{index + 1}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {formatDate(update.createdAt)}
            </p>
          </div>
          <motion.button
            onClick={() => openTextModal(update.content || "Kein Text")}
            className="
              bg-gray-700 bg-opacity-70 
              hover:bg-gray-600 
              text-white 
              rounded-full p-1 shadow-lg 
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 ease-in-out
              transition-transform transform hover:scale-110
            "
          >
            <Maximize2 size={18} />
          </motion.button>
        </div>

        {/* Update-Text mit Buttons unten rechts */}
        <motion.div
          className="relative overflow-auto px-6 break-words bg-black/90 backdrop-blur-sm"
          style={{ height: `${topPct}%` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: textDuration,
            type: "spring",
            stiffness: 200,
            damping: 30,
          }}
        >
          <p className="mt-3 whitespace-pre-wrap text-gray-200 leading-relaxed">
            {update.content ?? "Kein Text"}
          </p>

          {/* Like- & Comment-Buttons unten rechts */}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <motion.button className="bg-rose-500 bg-opacity-0 hover:bg-opacity-20 rounded-full p-2 shadow-lg transition-transform transform hover:scale-110">
              <ThumbsUp
                fill="none"
                stroke="currentColor"
                className="text-rose-500 opacity-75 w-6 h-6"
              />
            </motion.button>
            <motion.button className="bg-sky-500 bg-opacity-0 hover:bg-opacity-20 rounded-full p-2 shadow-lg transition-transform transform hover:scale-110">
              <MessageCircle
                fill="none"
                stroke="currentColor"
                className="text-sky-500 opacity-75 w-6 h-6"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Draggable Splitter */}
        <div
          onMouseDown={() => {
            dragging.current = true;
          }}
          className="h-1 bg-gray-700 cursor-row-resize"
        />

        {/* Bildbeschreibung Header + Fullscreen */}
        <div className="group px-6 py-4 flex items-baseline justify-between">
          <h3 className="text-2xl font-extrabold text-white drop-shadow-lg">
            Bildbeschreibung:
          </h3>
          <motion.button
            onClick={() =>
              openTextModal(
                images[currentImageIdx]?.imageText || "Keine Bildbeschreibung"
              )
            }
            className="
              bg-gray-700 bg-opacity-70 
              hover:bg-gray-600 
              text-white 
              rounded-full p-1 shadow-lg 
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 ease-in-out
              transition-transform transform hover:scale-110
            "
          >
            <Maximize2 size={18} />
          </motion.button>
        </div>

        {/* Bildbeschreibung-Text mit Buttons unten rechts */}
        <motion.div
          className="relative overflow-auto px-6 break-words bg-black/90 backdrop-blur-sm"
          style={{ height: `${100 - topPct}%` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: textDuration,
            type: "spring",
            stiffness: 200,
            damping: 30,
          }}
        >
          <p className="mt-3 whitespace-pre-wrap text-gray-200 leading-relaxed">
            {images[currentImageIdx]?.imageText ?? "Keine Bildbeschreibung"}
          </p>

          {/* Like- & Comment-Buttons unten rechts */}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <motion.button className="bg-rose-500 bg-opacity-0 hover:bg-opacity-20 rounded-full p-2 shadow-lg transition-transform transform hover:scale-110">
              <ThumbsUp
                fill="none"
                stroke="currentColor"
                className="text-rose-500 opacity-75 w-6 h-6"
              />
            </motion.button>
            <motion.button className="bg-sky-500 bg-opacity-0 hover:bg-opacity-20 rounded-full p-2 shadow-lg transition-transform transform hover:scale-110">
              <MessageCircle
                fill="none"
                stroke="currentColor"
                className="text-sky-500 opacity-75 w-6 h-6"
              />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
