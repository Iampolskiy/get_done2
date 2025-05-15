import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import EditUpdateClient from "./EditUpdateClient";

export default async function EditUpdatePage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  const me = await currentUser();
  const email = me?.emailAddresses?.[0]?.emailAddress;
  const user = email
    ? await prisma.user.findUnique({ where: { email } })
    : null;

  if (!user) throw new Error("Nicht authentifiziert");

  const update = await prisma.update.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!update) throw new Error("Update nicht gefunden");
  if (update.authorId !== user.id) throw new Error("Keine Berechtigung");

  return <EditUpdateClient update={update} />;
}
