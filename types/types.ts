export type Challenge = {
  id?: number;
  title?: string;
  category?: string;
  description?: string;
  difficulty: string;
  completed: boolean;
  progress: number;
  duration: number;
  author?: {
    name: string;
  };
  age: number;
  gender: string;
  created_at: Date;
  updated_at: Date;
  city_adress: string;
  goal: string;
};

export type Challenges = {
  challenge: Challenge[];
};

export type User = {
  id: number;
  name: string;
  email: string;
  challenges: {
    id: number;
  };
};

export type Users = {
  user: User[];
};
