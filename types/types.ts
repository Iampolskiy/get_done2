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
  created_at?: string | null;
  updated_at?: string | null;
  city_address?: string | null;
  goal?: string | null;
  image?: Uint8Array<ArrayBufferLike> | null;
};

export type ChallengeWithImageUrl = Omit<Challenge, "image"> & {
  imageUrl?: string | null; // Neues Feld für den Base64-String
};
