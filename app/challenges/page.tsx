// app/challenges/page.tsx
import { Challenge } from "@/types/types";
import prisma from "@/lib/prisma";
import ChallengesClient from "./ChallengesClient";
import GlobeLoader from "@/components/GlobeLoader";

export default async function ChallengesPage() {
  // fetch everything we need
  const raw = await prisma.challenge.findMany({
    include: {
      images: true,
      updates: { include: { images: true } },
      author: true,
    },
  });

  // map to your front-end Challenge type
  const challenges: Challenge[] = raw.map((c) => ({
    ...c,
    // turn Date → string (or drop if unused)
    created_at: c.created_at?.toISOString() ?? null,
    updated_at: c.updated_at?.toISOString() ?? null,
    edited_at: c.edited_at?.toISOString() ?? null,
    // ensure isMain is boolean
    images: c.images.map((img) => ({ ...img, isMain: Boolean(img.isMain) })),
    // map updates into your shape
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
        isMain: Boolean(img.isMain),
      })),
    })),
  }));

  return (
    <>
      <ChallengesClient challenges={challenges} />
      <div style={{ width: "100vw", height: "90vh", marginTop: "2rem" }}>
        <GlobeLoader />
      </div>
    </>
  );
}
