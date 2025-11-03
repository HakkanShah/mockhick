
import type { User as FirebaseUser } from "firebase/auth";

export type SerializableTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Interview {
  id: string;
  userId: string;
  role: string;
  experienceLevel: string;
  jobDescriptionKeywords: string;
  questions: string[];
  answers: { questionIndex: number; answer: string }[];
  status: "pending" | "in-progress" | "completed";
  createdAt: SerializableTimestamp | null;
  completedAt?: SerializableTimestamp | null;
  feedback?: {
    overallScore: number;
    strengths: string;
    areasOfImprovement: string;
  };
}

// PlainInterview is used for client components and is the same as Interview now
// that server actions handle serialization.
export type PlainInterview = Interview;
