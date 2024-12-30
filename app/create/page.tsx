"use server";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import CreateClient from "./CreateClient";

export default async function createPage() {
  const userNow = await currentUser();
  const userNowEmail = userNow?.emailAddresses?.[0]?.emailAddress;

  // Überprüfe, ob der Benutzer authentifiziert ist und eine E-Mail-Adresse hat
  if (!userNow || !userNowEmail) {
    return (
      <div>
        <p>Benutzer ist nicht authentifiziert oder E-Mail-Adresse fehlt.</p>
      </div>
    );
  }
  return (
    <>
      <CreateClient />
    </>
  );
}
