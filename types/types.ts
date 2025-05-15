// -------------- BASIS‑INTERFACES ----------------
export interface Challenges {
  challenge: Challenge[];
}

export interface Users {
  user: User[];
}

export interface User {
  id: number;
  clerkId: string | null;
  name: string | null;
  email: string | null;
  challenges: { id: number }[];
}

// -------------- CHALLENGE ------------------------
export interface Challenge {
  id: number;
  title: string;
  category?: string | null;
  difficulty?: string | null;
  description?: string | null;
  duration?: number | null;
  completed?: boolean | null;
  progress?: number | null;
  age?: number | null;
  gender?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  edited_at?: Date | null;
  city_address?: string | null;
  goal?: string | null;

  // Relationen
  author: {
    id: number;
    email?: string | null;
    clerkId?: string | null;
    name?: string | null;
  };
  authorId: number;

  images?: Image[]; // alle Bilder (Haupt + Update)
  updates: Update[]; // Update‑Einträge
}

// -------------- IMAGE ---------------------------
export interface Image {
  id: number;
  url: string;
  description?: string | null;
  duration: number;
  created_at?: Date | null;
  updated_at?: Date | null;

  challengeId?: number | null;
  updateId?: number | null;
  userId: number | null;

  isMain?: boolean | null;
}

// -------------- UPDATE --------------------------
export interface Update {
  id: number;
  challengeId: number;
  authorId?: number | null;

  content: string | null; // gespeicherter Text
  /* date: string; */ // Datum als ISO‑String
  createdAt: string | Date;
  type: "CREATED" | "UPDATED" | "DELETED";

  images?: Image[];
}

// -------------- CLIENT‑PROP ---------------------
export interface ChallengeClientProps {
  challenge: Challenge;
}
