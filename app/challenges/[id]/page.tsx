import React from "react";
import { PrismaClient } from "@prisma/client";
import { Challenge } from "@/types/types";
import ChallengeClient from "./ChallengeClient";

export default async function ChallengePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const prisma = new PrismaClient();
  const numericId = parseInt(id, 10);
  const challenge = (await prisma.challenge.findUnique({
    where: {
      id: numericId,
    },
    include: {
      author: true, // Lade auch die Autoren-Information
    },
  })) as Challenge;

  if (!challenge) {
    return <div>Challenge not found</div>;
  }

  return <ChallengeClient challenge={challenge} />;
}
