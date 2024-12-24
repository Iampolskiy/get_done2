import React from "react";
import { PrismaClient } from "@prisma/client";
import { Challenge } from "@/types/types";
import ChallengeClient from "./ChallengeClient";

export default async function ChallengePage({
  params,
}: {
  params: { id: string };
}) {
  const prisma = new PrismaClient();
  const id = parseInt(params.id, 10);
  const challenge = (await prisma.challenge.findUnique({
    where: {
      id: id,
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
