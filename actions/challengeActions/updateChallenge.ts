"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function createUpdate(challengeId: string, formData: FormData) {
  // 1. ✅ Authentifizierung
  const userNow = await currentUser();
  if (!userNow) throw new Error("Benutzer ist nicht authentifiziert");

  const email = userNow.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("Keine E-Mail-Adresse gefunden");

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error("Benutzer nicht in der Datenbank gefunden");

  // 2. ✅ Challenge prüfen
  const challenge = await prisma.challenge.findUnique({
    where: { id: parseInt(challengeId, 10) },
  });
  if (!challenge) throw new Error("Challenge nicht gefunden");
  if (challenge.authorId !== user.id) {
    throw new Error(
      "Du hast keine Berechtigung, diese Challenge zu aktualisieren"
    );
  }

  // 3. ✅ Update-Text lesen
  const updateText = formData.get("updateText") as string;
  if (!updateText) throw new Error("Update-Text fehlt");

  // ✅ NEU: URLs von Bildern statt Files
  const imageUrls = formData.getAll("imageUrls") as string[];

  // 4. ✅ Speichern mit Prisma-Transaktion
  await prisma.$transaction(async (tx) => {
    const update = await tx.update.create({
      data: {
        challengeId: challenge.id,
        authorId: user.id,
        content: updateText,
        type: "UPDATED",
      },
    });

    // ✅ Nur wenn Bilder vorhanden sind
    if (imageUrls.length > 0) {
      await tx.image.createMany({
        data: imageUrls.map((url) => ({
          url,
          duration: 0, // Beispielwert
          challengeId: challenge.id,
          updateId: update.id,
          userId: user.id,
        })),
      });
    }
  });

  // 5. ✅ Weiterleitung
  redirect(`/update/${challengeId}?editSuccess=true`);
}
