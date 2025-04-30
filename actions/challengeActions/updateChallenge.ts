"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// 📦 Hilfsfunktion zum Upload zu Cloudinary
async function uploadImages(files: File[]): Promise<string[]> {
  const uploads = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "challenge_updates" },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      stream.end(buffer);
    });
    return url;
  });

  return Promise.all(uploads);
}

export async function createUpdate(challengeId: string, formData: FormData) {
  // 1. Authentifiziere den aktuellen Benutzer
  const userNow = await currentUser();
  if (!userNow) throw new Error("Benutzer ist nicht authentifiziert");

  const email = userNow.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("Keine E-Mail-Adresse gefunden");

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error("Benutzer nicht in der Datenbank gefunden");

  // 2. Lade die Challenge und prüfe Ownership
  const challenge = await prisma.challenge.findUnique({
    where: { id: parseInt(challengeId, 10) },
  });
  if (!challenge) throw new Error("Challenge nicht gefunden");
  if (challenge.authorId !== user.id) {
    throw new Error(
      "Du hast keine Berechtigung, diese Challenge zu aktualisieren"
    );
  }

  // 3. Extrahiere Formulardaten
  const updateText = formData.get("updateText") as string;
  if (!updateText) throw new Error("Update-Text fehlt");

  const files = formData.getAll("images") as File[];

  // 4. Lade Bilder hoch
  const imageUrls = await uploadImages(files);

  // 5. Speichere Update + Bilder in einer Transaktion
  await prisma.$transaction(async (tx) => {
    const update = await tx.update.create({
      data: {
        challengeId: challenge.id,
        authorId: user.id,
        content: updateText,
        type: "UPDATED",
      },
    });

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

  // 6. Weiterleitung
  redirect(`/update/${challengeId}?editSuccess=true`);
}
