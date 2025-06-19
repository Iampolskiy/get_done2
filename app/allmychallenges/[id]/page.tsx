/* app/allmychallenges/[id]/page.tsx */
"use server";

import { Image as PrismaImage, Update as PrismaUpdate } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import MyChallengeClient from "./MyChallengeClient";
import prisma from "@/lib/prisma";

/* ---------- Frontend‑Typen ----------------------------------- */
import {
  Challenge as ChallengeType,
  Image as ImageType,
  Update as UpdateType,
} from "@/types/types";

/* ---------- Prisma Client (Singleton wäre noch besser) ------- */

export default async function ChallengesPage({
  params,
}: {
  params: { id: string };
}) {
  /* ---------- Auth‑Check ------------------------------------- */
  const me = await currentUser();
  const email = me?.emailAddresses?.[0]?.emailAddress;

  if (!me || !email) {
    return (
      <div>
        <p>Benutzer ist nicht authentifiziert oder E‑Mail-Adresse fehlt.</p>
      </div>
    );
  }

  /* ---------- Challenge laden -------------------------------- */
  const numericId = await parseInt(params.id, 10);
  const challengeDb = await prisma.challenge.findUnique({
    where: { id: numericId },
    include: {
      author: true,
      images: true,
      updates: { include: { images: true } },
    },
  });

  if (!challengeDb) {
    return <div>Challenge nicht gefunden</div>;
  }

  /* ---------- Helper Mapper --------------------------------- */
  const mapImage = (img: PrismaImage): ImageType => ({
    id: img.id,
    url: img.url,
    description: img.description ?? null,
    duration: img.duration,
    created_at: img.created_at ?? undefined,
    updated_at: img.updated_at ?? undefined,
    isMain: img.isMain ?? false,
    challengeId: img.challengeId,
    updateId: img.updateId ?? null,
    userId: img.userId ?? null,
  });

  const mapUpdate = (
    u: PrismaUpdate & { images: PrismaImage[] }
  ): UpdateType => ({
    id: u.id,
    challengeId: u.challengeId,
    authorId: u.authorId ?? null,
    content: u.content ?? "",
    /*     date: u.createdAt.toISOString(),
     */
    createdAt: u.createdAt,
    type: u.type,
    images: u.images.map(mapImage),
    date: u.createdAt.toISOString(),
  });

  /* ---------- In Frontend‑Typ transformieren ----------------- */
  const mappedChallenge: ChallengeType = {
    ...challengeDb,
    images: challengeDb.images.map(mapImage),
    updates: challengeDb.updates.map(mapUpdate),
  };

  return <MyChallengeClient challenge={mappedChallenge} />;
}
