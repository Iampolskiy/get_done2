import { Challenge } from "@/types/types";
import React from "react";

type ChallengeClientProps = {
  challenge: Challenge;
};

export default function EditClient({ challenge }: ChallengeClientProps) {
  return <div>{challenge.id}</div>;
}
