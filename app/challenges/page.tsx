// app/challenges/page.tsx
import { Challenge as ChallengeType } from "@/types/types";
import prisma from "@/lib/prisma";
import ChallengesClient from "./ChallengesClient";
/* import GlobeLoader from "@/components/GlobeLoader"; */

export default async function ChallengesPage() {
  const raw = await prisma.challenge.findMany({
    include: {
      images: true,
      updates: { include: { images: true } },
      author: true,
    },
  });
  const challenges: ChallengeType[] = raw.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    difficulty: c.difficulty,
    description: c.description,
    duration: c.duration,
    completed: Boolean(c.completed),
    authorId: c.authorId,
    progress: c.progress ?? 0,
    age: c.age ?? 0,
    gender: c.gender ?? "",
    created_at: c.created_at ? c.created_at.toISOString() : null,
    updated_at: c.updated_at ? c.updated_at.toISOString() : null,
    edited_at: c.edited_at ? c.edited_at.toISOString() : null,
    city_address: c.city_address ?? "",
    country: c.country ?? "",
    goal: c.goal ?? "",
    images: c.images.map((img) => ({
      id: img.id,
      url: img.url,
      description: img.description,
      imageText: img.imageText ?? "",
      duration: img.duration,
      created_at: img.created_at ? img.created_at.toISOString() : null,
      updated_at: img.updated_at ? img.updated_at.toISOString() : null,
      isMain: Boolean(img.isMain),
      challengeId: img.challengeId,
      userId: img.userId ?? 0,
      updateId: img.updateId ?? 0,
    })),
    updates: (c.updates ?? []).map((u) => ({
      id: u.id,
      content: u.content ?? "",
      date: u.createdAt.toISOString(),
      createdAt: u.createdAt.toISOString(),
      type: u.type,
      challengeId: u.challengeId,
      userId: u.authorId ?? 0,
      images: u.images.map((img) => ({
        id: img.id,
        url: img.url,
        description: img.description,
        imageText: img.imageText ?? "",
        duration: img.duration,
        created_at: img.created_at ? img.created_at.toISOString() : null,
        updated_at: img.updated_at ? img.updated_at.toISOString() : null,
        isMain: Boolean(img.isMain),
        challengeId: img.challengeId,
        userId: img.userId ?? 0,
        updateId: img.updateId ?? 0,
      })),
    })),
  }));

  return (
    <>
      {/* 1) Oben: Gesamtliste aller Challenges (ohne Globe) */}
      <div style={{ padding: "16px", backgroundColor: "#111" }}>
        <ChallengesClient challenges={challenges} showCity={false} />
      </div>

      {/* 2) Unten: Globe & Länder-Interaktion */}
      {/*  <div style={{ width: "100vw", height: "100vh", marginTop: "6rem" }}>
        <GlobeLoader challenges={challenges} />
      </div> */}
    </>
  );
}
