// app/deleteUpdate/[id]/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import DeleteUpdateClient from "./DeleteUpdateClient";

export default async function DeleteUpdatePage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  const me = await currentUser();

  if (!me?.emailAddresses[0]?.emailAddress)
    throw new Error("Nicht authentifiziert");

  const user = await prisma.user.findUnique({
    where: { email: me.emailAddresses[0].emailAddress },
  });

  if (!user) throw new Error("Benutzer nicht gefunden");

  const update = await prisma.update.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!update || update.authorId !== user.id) {
    throw new Error("Keine Berechtigung oder Update nicht gefunden");
  }

  return (
    <>
      <DeleteUpdateClient
        update={{ ...update, date: update.createdAt.toString() }}
      />
    </>
  );
}
