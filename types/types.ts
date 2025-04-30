// types/types.ts

export interface Challenges {
  challenge: Challenge[];
}

export interface Users {
  user: User[];
}

export interface User {
  id: number;
  clerkId: string; // Hinweis: Falls ClerkId optional sein soll, => string | null
  name: string;
  email: string;
  challenges: {
    id: number;
  };
}

export interface Challenge {
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
  edited_at?: Date | null; // ✅ ergänzt
  city_address?: string | null;
  goal?: string | null;
  images?: Image[];
  updates: UpdateProgress[];
}

export interface Image {
  id: number;
  url: string;
  description?: string | null;
  duration: number;
  created_at?: Date | null;
  updated_at?: Date | null;
  challengeId: number;
  userId: number | null;
  updateId?: number | null;
}

export interface UpdateProgress {
  id: number;
  challengeId: number;
  authorId?: number | null;
  updateText: string; // ⬅️ MUSS hinzugefügt werden
  /* content?: string | null; */
  date: string; // <-- ❗️dieser Eintrag muss vorhanden sein
  createdAt: string | Date;
  type: "CREATED" | "UPDATED" | "DELETED";
  images?: Image[];
}

export interface ChallengeClientProps {
  challenge: Challenge;
}
