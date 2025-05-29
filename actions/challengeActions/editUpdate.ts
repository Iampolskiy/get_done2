// actions/updateActions/editUpdate.ts
"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function editUpdate(
  formData: FormData,
  images: string[]
): Promise<void> {
  const updateId = parseInt(formData.get("updateId") as string, 10);
  const updateText = formData.get("updateText") as string;

  if (!updateText) throw new Error("Update-Text fehlt.");

  const me = await currentUser();
  if (!me?.emailAddresses?.[0]?.emailAddress) {
    throw new Error("Nicht authentifiziert");
  }

  const user = await prisma.user.findUnique({
    where: { email: me.emailAddresses[0].emailAddress },
  });

  if (!user) throw new Error("Benutzer nicht gefunden");

  const update = await prisma.update.findUnique({ where: { id: updateId } });

  if (!update || update.authorId !== user.id) {
    throw new Error("Keine Berechtigung oder Update nicht gefunden");
  }

  await prisma.$transaction(async (tx) => {
    await tx.update.update({
      where: { id: updateId },
      data: { content: updateText, type: "UPDATED" },
    });

    // Vorherige Bilder entfernen
    await tx.image.deleteMany({ where: { updateId } });

    // Neue Bilder hinzufügen
    if (images.length > 0) {
      await tx.image.createMany({
        data: images.map((url) => ({
          url,

          updateId,
          challengeId: update.challengeId, // aus vorhandenem Update übernommen
          userId: user.id,
          isMain: false,
          duration: 0,
        })),
      });
    }
  });

  redirect(`/allmychallenges/${update.challengeId}?updated=true`);
}
