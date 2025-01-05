import PinataUp from "@/components/CloudinaryUp";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

export default async function page() {
  const userNow = await currentUser();
  const userNowEmail = userNow?.emailAddresses?.[0]?.emailAddress;

  if (!userNow || !userNowEmail) {
    return (
      <div>
        <p>Benutzer ist nicht authentifiziert oder E-Mail-Adresse fehlt.</p>
      </div>
    );
  }
  return <PinataUp />;
}
