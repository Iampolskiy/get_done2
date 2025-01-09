"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma"; // Singleton Prisma Client

// Server Action zum Löschen einer Herausforderung
export async function deleteChallenge(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Keine ID angegeben");
  }
  // Authentifiziere den aktuellen Benutzer
  const userNow = await currentUser();

  if (!userNow) {
    throw new Error("Benutzer ist nicht authentifiziert");
  }

  const userNowEmail = userNow.emailAddresses?.[0]?.emailAddress;

  if (!userNowEmail) {
    throw new Error("Keine E-Mail-Adresse gefunden für den aktuellen Benutzer");
  }

  // Finde den Benutzer in der Datenbank anhand der E-Mail
  const user = await prisma.user.findUnique({
    where: {
      email: userNowEmail,
    },
  });

  if (!user) {
    throw new Error("Benutzer nicht gefunden");
  }

  // Überprüfe, ob die Herausforderung dem aktuellen Benutzer gehört
  const challenge = await prisma.challenge.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!challenge) {
    throw new Error("Herausforderung nicht gefunden");
  }

  if (challenge.authorId !== user.id) {
    throw new Error(
      "Du hast keine Berechtigung, diese Herausforderung zu löschen"
    );
  }

  // Lösche die Herausforderung
  await prisma.challenge.delete({
    where: { id: parseInt(id, 10) },
  });

  /* await prisma.$transaction(async (tx) => {
    // Lösche verknüpfte Bilder
    await tx.image.deleteMany({
      where: { challengeId: parseInt(id, 10) },
    });

    // Lösche die Challenge
    await tx.challenge.delete({
      where: { id: parseInt(id, 10) },
    });
  }); */

  // Weiterleitung nach erfolgreichem Löschen
  redirect("/allmychallenges?deletesuccess=true");
}
