// app/allmychallenges/[id]/page.tsx
"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import UpdateClient from "./UpdateClient";
import type { Challenge } from "@/types/types";

export default async function UpdatePage({
  params,
}: {
  params: { id: string };
}) {
  const userNow = await currentUser();
  if (!userNow) return <p>Nicht eingeloggt</p>;

  const { id } = params;
  const numericId = parseInt(id, 10);

  const challengeRaw = await prisma.challenge.findUnique({
    where: { id: numericId },
    include: {
      author: true,
      images: true,
      updates: {
        include: {
          images: true, // Bilder der Updates laden
        },
      },
    },
  });

  if (!challengeRaw) return <p>Challenge nicht gefunden</p>;

  // Mapping auf unser Challenge-Interface
  const challenge: Challenge = {
    // Basis-Felder
    id: challengeRaw.id,
    title: challengeRaw.title,
    category: challengeRaw.category,
    difficulty: challengeRaw.difficulty,
    description: challengeRaw.description,
    duration: challengeRaw.duration,
    completed: challengeRaw.completed,
    progress: challengeRaw.progress,
    age: challengeRaw.age,
    gender: challengeRaw.gender,
    created_at: challengeRaw.created_at,
    updated_at: challengeRaw.updated_at,
    edited_at: challengeRaw.edited_at,
    city_address: challengeRaw.city_address,
    goal: challengeRaw.goal,
    author: {
      id: challengeRaw.author.id,
      email: challengeRaw.author.email ?? undefined,
      clerkId: challengeRaw.author.clerkId ?? undefined,
      name: challengeRaw.author.name ?? undefined,
    },
    authorId: challengeRaw.authorId,

    // Alle Challenge-Bilder mit isMain → boolean casten
    images: challengeRaw.images.map((img) => ({
      ...img,
      isMain: !!img.isMain,
    })),

    // Updates mappen
    updates: challengeRaw.updates.map((u) => ({
      id: u.id,
      updateText: u.content ?? "",
      date: u.createdAt.toISOString(),
      createdAt: u.createdAt.toISOString(),
      type: u.type,
      challengeId: u.challengeId,
      authorId: u.authorId ?? undefined,
      userId: u.authorId ?? 0,
      images: u.images.map((img) => ({
        ...img,
        isMain: !!img.isMain,
      })),
    })),
  };

  return <UpdateClient challenge={challenge} />;
}
