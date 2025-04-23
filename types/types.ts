/* export type Challenge = {
  id?: number;
  title?: string;
  category?: string;
  description?: string;
  difficulty: string;
  completed: boolean;
  progress: number;
  duration: number;
  author?: {
    user: User;
  };
  age: number;
  gender: string;
  created_at: Date;
  updated_at: Date;
  city_address: string;
  goal: string;
}; */

/* import { Buffer } from "buffer"; */

export type Challenges = {
  challenge: Challenge[];
};

export type User = {
  id: number;
  clerkId: number;
  name: string;
  email: string;
  challenges: {
    id: number;
  };
};

export type Users = {
  user: User[];
};

// types/types.ts

export type Challenge = {
  id: number;
  title: string;
  category?: string | null;
  difficulty?: string | null;
  description?: string | null;
  duration?: number | null;
  completed?: boolean | null;
  author: {
    id: number;
    email?: string | null;
    clerkId?: string | null;
    name?: string | null;
  };
  authorId: number;
  progress?: number | null;
  age?: number | null;
  gender?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  city_address?: string | null;
  goal?: string | null;
  images?: {
    id: number;
    description: string | null;
    duration: number;
    created_at: Date | null;
    updated_at: Date | null;
    url: string;
    challengeId: number;
    userId: number | null;
  }[];
};

export type Image = {
  id: number;
  url: string;
  description?: string | null;
  duration?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  challenge: Challenge;
  challengeId: number;
  user: User;
  userId: number;
};

export type ChallengeClientProps = {
  challenge: Challenge;
};

/*  /*   id          Int       @id @default(autoincrement())
  url         String    // URL oder Pfad zum Bild
  description String?
  duration    Int       // Dauer oder Tag, z.B. "Tag 16"
  created_at  DateTime? @default(now())
  updated_at  DateTime? @updatedAt
  challenge   Challenge @relation(fields: [challengeId], references: [id])
  challengeId Int       // Fremdschlüssel zu Challenge
  user        User?     @relation(fields: [userId], references: [id])
  userId   */
