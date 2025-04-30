import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import UpdateClient from "./UpdateClient";
import type { Challenge, UpdateProgress } from "@/types/types";

export default async function UpdatePage({
  params,
}: {
  params: { id: string };
}) {
  const userNow = await currentUser();
  if (!userNow) return <p>Nicht eingeloggt</p>;

  const { id } = await params;
  const numericId = parseInt(id, 10);

  const challengeRaw = await prisma.challenge.findUnique({
    where: { id: numericId },
    include: {
      author: true,
      images: true,
      updates: {
        include: {
          images: true, // ✅ <-- WICHTIG: Bilder der Updates laden!
        },
      },
    },
  });

  if (!challengeRaw) return <p>Challenge nicht gefunden</p>;

  // Jetzt MAPPEN
  const challenge: Challenge = {
    ...challengeRaw,
    updates: challengeRaw.updates.map((update) => ({
      id: update.id,
      updateText: update.content ?? "",
      date: update.createdAt.toISOString(),
      createdAt: update.createdAt.toISOString(),
      type: update.type,
      challengeId: update.challengeId,
      userId: update.authorId ?? 0,
      images: update.images ?? [], // <-- Wichtig!
    })),
  };

  return <UpdateClient challenge={challenge} />;
}
