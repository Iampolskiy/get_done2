// app/allmychallenges/[id]/MyChallengeClient.tsx
"use client";

import { Challenge } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { deleteChallenge } from "@/actions/challengeActions/deleteChallenge";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

type Props = { challenge: Challenge };

export default function MyChallengeClient({ challenge }: Props) {
  /* ------------------------------------------------------------------ */
  /*  SICHERE DATEN                                                     */
  /* ------------------------------------------------------------------ */
  const images = challenge.images ?? [];
  const updates = challenge.updates ?? [];

  /* ------------------------------------------------------------------ */
  /*  STATE & SLIDER‑SETUP                                              */
  /* ------------------------------------------------------------------ */
  const [activeIdx, setActiveIdx] = useState(updates.length - 1);

  /* Slider ① – Update‑Cards ----------------------------------------- */
  const [cardRef, cardInstance] = useKeenSlider<HTMLDivElement>({
    initial: activeIdx,
    slideChanged: (s) => setActiveIdx(s.track.details.rel),
    slides: { perView: 1, spacing: 24, origin: "center" },
  });

  /* Slider ② – Timeline (nur falls > 8) ------------------------------ */
  const needTlSlider = updates.length > 8;
  const [tlRef, tlInstance] = useKeenSlider<HTMLDivElement>(
    needTlSlider
      ? { rubberband: false, slides: { perView: 8, spacing: 12 } }
      : undefined
  );

  /* ❗ Synchronisation beider Slider über activeIdx ------------------ */
  useEffect(() => {
    if (cardInstance.current) cardInstance.current.moveToIdx(activeIdx, true);
    if (needTlSlider && tlInstance.current)
      tlInstance.current.moveToIdx(activeIdx, true);
  }, [activeIdx, cardInstance, tlInstance, needTlSlider]); /** <- NEU **/

  /* Direktes Anspringen per Timeline‑Dot ----------------------------- */
  const goTo = useCallback((idx: number) => setActiveIdx(idx), []);

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <section className="bg-neutral-50 min-h-screen px-4 md:px-8 py-10">
      {/* ---------- HEADER ------------------------------------------ */}
      <header className="max-w-3xl mx-auto space-y-4">
        {images.length > 0 && (
          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-sm">
            <Image
              src={images[0].url}
              alt={challenge.title}
              fill
              sizes="(max-width:768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            {challenge.goal && (
              <p className="text-gray-600 mt-0.5">{challenge.goal}</p>
            )}
          </div>
          <span
            className={`inline-flex items-center h-8 px-3 rounded-full text-sm font-medium ${
              challenge.completed
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {challenge.completed ? "Abgeschlossen" : "In Bearbeitung"}
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600"
            style={{ width: `${challenge.progress ?? 0}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/update/${challenge.id}`}
            className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-center transition"
          >
            Fortschritt eintragen
          </Link>
          <Link
            href={`/edit/${challenge.id}`}
            className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center transition"
          >
            Challenge bearbeiten
          </Link>
          <form action={deleteChallenge} className="flex-1 min-w-[140px]">
            <input type="hidden" name="id" value={challenge.id} />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
            >
              Challenge löschen
            </button>
          </form>
        </div>
      </header>

      {/* ---------- TIMELINE ---------------------------------------- */}
      {updates.length > 0 && (
        <div className="max-w-3xl mx-auto mt-10 space-y-4">
          <h2 className="font-semibold text-lg">Timeline</h2>

          <div
            ref={tlRef}
            className={
              needTlSlider ? "keen-slider" : "flex overflow-x-auto gap-3"
            }
          >
            {updates.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`${needTlSlider ? "keen-slider__slide" : ""} 
                           shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                           text-sm font-medium transition border
                           ${
                             idx === activeIdx
                               ? "bg-blue-600 text-white border-blue-600 scale-105"
                               : "bg-gray-200 text-gray-800 border-transparent hover:bg-gray-300"
                           }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- UPDATE‑CARDS ----------------------------------- */}
      {updates.length > 0 && (
        <div className="max-w-3xl mx-auto mt-8">
          <div ref={cardRef} className="keen-slider">
            {updates.map((u) => {
              const imgs = u.images ?? [];

              return (
                <article
                  key={u.id}
                  className="keen-slider__slide bg-white rounded-xl shadow p-4 md:p-6 space-y-4"
                >
                  {imgs.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {imgs.map((img) => (
                        <div
                          key={img.id}
                          className="relative w-full aspect-[4/3]"
                        >
                          <Image
                            src={img.url}
                            alt="Update Bild"
                            fill
                            sizes="(max-width:768px) 50vw, 200px"
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1">
                    <time className="text-sm text-gray-500">
                      {new Date(u.date).toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </time>
                    <p className="text-gray-700 leading-relaxed">
                      {u.updateText}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
