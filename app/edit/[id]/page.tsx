"use server";

import React from "react";
import { Challenge } from "@/types/types";
import prisma from "@/lib/prisma"; // Importiere den Singleton Prisma Client
import EditClient from "./EditClient";
import { currentUser } from "@clerk/nextjs/server";

export default async function editPage({ params }: { params: { id: string } }) {
  const userNow = await currentUser();
  const userNowEmail = userNow?.emailAddresses?.[0]?.emailAddress;
  if (!userNow || !userNowEmail) {
    return (
      <div>
        <p>Benutzer ist nicht authentifiziert oder E-Mail-Adresse fehlt.</p>
      </div>
    );
  }
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const challenge = (await prisma.challenge.findUnique({
    where: {
      id: numericId,
    },
    include: {
      author: true, // Lade auch die Autoren-Information
      images: true, // Lade auch die Bilder
    },
  })) as unknown as Challenge;

  if (!challenge) {
    return <div>Challenge not found</div>;
  }
  /* const challengeWithImages = {
    ...challenge,
    images: challenge.images?.map((image) => image.url),
  }; */

  return <EditClient challenge={challenge} />;
}
