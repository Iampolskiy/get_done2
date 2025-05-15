import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import React from "react";
import MyChallengesClient from "./MyChallengesClient";
import Feedback from "@/components/Feedback";
import type { Challenge } from "@/types/types";

export default async function MyChallengesPage() {
  /* -------- Auth --------------------------------------------- */
  const me = await currentUser();
  const email = me?.emailAddresses?.[0]?.emailAddress;
  if (!me || !email)
    return <p>Benutzer ist nicht authentifiziert oder E-Mail fehlt.</p>;

  /* -------- Prisma-Query ------------------------------------- */
  const challengesRaw = await prisma.challenge.findMany({
    where: { author: { email } },
    include: {
      author: true,
      images: true,
      updates: { include: { images: true } },
    },
  });

  /* -------- Mapping auf Challenge-Typ ------------------------ */
  const challenges: Challenge[] = challengesRaw.map((c) => ({
    ...c,
    /* Bild-Typ anpassen (isMain: null → false) */
    images: c.images.map((img) => ({
      ...img,
      isMain: !!img.isMain,
    })),

    /* Updates mappen */
    updates: (c.updates ?? []).map((u) => ({
      id: u.id,
      content: u.content ?? "",
      date: u.createdAt.toISOString(),
      createdAt: u.createdAt.toISOString(),
      type: u.type,
      challengeId: u.challengeId,
      userId: u.authorId ?? 0,
      images: u.images.map((img) => ({
        ...img,
        isMain: !!img.isMain,
      })),
    })),
  }));

  /* -------- Render ------------------------------------------- */
  return (
    <>
      <Feedback />
      <MyChallengesClient challenges={challenges} />
    </>
  );
}
