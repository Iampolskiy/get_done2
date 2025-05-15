// actions/updateActions/deleteUpdate.ts
"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function deleteUpdate(formData: FormData): Promise<void> {
  const updateId = parseInt(formData.get("updateId") as string, 10);
  if (Number.isNaN(updateId)) throw new Error("Ungültige Update-ID");

  const me = await currentUser();
  if (!me?.emailAddresses[0]?.emailAddress) {
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
    await tx.image.deleteMany({ where: { updateId } });
    await tx.update.delete({ where: { id: updateId } });
  });

  redirect(`/allmychallenges/${update.challengeId}?deleted=true`);
}
