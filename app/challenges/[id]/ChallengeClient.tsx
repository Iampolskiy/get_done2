// app/challenges/[id]/ChallengeClient.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Challenge, Update } from "@/types/types";

type ChallengeClientProps = {
  challenge: Challenge;
};

export default function ChallengeClient({ challenge }: ChallengeClientProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Modal state: type can be "image" or "text"
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"image" | "text" | null>(null);
  const [modalContent, setModalContent] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const updateRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  // Calculate currentIdx on scroll
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

  // Modal functions
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

  return (
    <div className="h-screen overflow-hidden bg-gray-900">
      {/* Invisible strip at top to forward wheel events */}
      <div
        className="fixed top-0 left-0 right-0 h-2 z-40"
        onWheel={(e) => {
          scrollRef.current?.scrollBy({
            top: e.deltaY,
            behavior: "auto",
          });
        }}
      />

      {/* Modal overlay */}
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

      {/* Scrollable area */}
      <div
        ref={scrollRef}
        className="absolute top-0 bottom-0 left-0 right-0 overflow-y-auto hide-scrollbar"
      >
        {challenge.updates.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4 text-gray-400">
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
              <div className="w-full h-full p-16 flex items-center justify-center">
                <UpdateSlide
                  update={update}
                  openImageModal={openImageModal}
                  openTextModal={openTextModal}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-800 flex items-center justify-center space-x-6 z-50">
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
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ─────────────────────────── Funktion: UpdateSlide ───────────────────────────
// ──────────────────────────────────────────────────────────────────────────────

type UpdateSlideProps = {
  update: Update;
  openImageModal: (url: string) => void;
  openTextModal: (text: string) => void;
};

function UpdateSlide({
  update,
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

  // Track current slide index
  useEffect(() => {
    instanceRef.current?.on("slideChanged", (s) => {
      setCurrentImageIdx(s.track.details.rel);
    });
  }, [instanceRef]);

  // Drag-splitter state
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
        <div ref={sliderRef} className="keen-slider w-full h-full">
          {images.length > 0 ? (
            images.map((img, i) => (
              <div
                key={i}
                className="keen-slider__slide relative w-full h-full group"
              >
                <Image
                  src={img.url}
                  alt={`Update-Bild ${i + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => openImageModal(img.url)}
                  className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 hidden group-hover:flex items-center justify-center transition"
                >
                  <Maximize2 size={20} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              kein Bild
            </div>
          )}
        </div>
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

      {/* ─── Rechte Hälfte: Textbereich mit draggable Splitter (1/3 Breite) ── */}
      <div
        ref={containerRef}
        className="w-1/3 flex flex-col h-full select-none"
      >
        {/* ─── Update-Text (oben) */}
        <div className="relative group px-6 pt-6">
          <h2 className="text-2xl font-semibold text-orange-500">
            Recent Update
          </h2>
          <div className="h-px bg-orange-500 opacity-80 my-2" />
          <button
            onClick={() => openTextModal(update.content || "Kein Text")}
            className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 hidden group-hover:flex items-center justify-center transition"
          >
            <Maximize2 size={18} />
          </button>
        </div>
        <motion.div
          className="overflow-auto px-6 break-words"
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

        {/* ─── Draggable Splitter ─────────────────────────────────────────── */}
        <div
          onMouseDown={() => {
            dragging.current = true;
          }}
          className="h-1 bg-gray-700 cursor-row-resize"
        />

        {/* ─── Bildbeschreibung (unten) */}
        <div className="relative group px-6 pt-4">
          <div className="h-px bg-gray-600 opacity-50 mb-2" />
          <h3 className="text-xl font-semibold text-gray-300">
            Bildbeschreibung:
          </h3>
          <button
            onClick={() =>
              openTextModal(
                images[currentImageIdx]?.imageText || "Keine Bildbeschreibung"
              )
            }
            className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 hidden group-hover:flex items-center justify-center transition"
          >
            <Maximize2 size={18} />
          </button>
        </div>
        <motion.div
          className="overflow-auto px-6 break-words"
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
