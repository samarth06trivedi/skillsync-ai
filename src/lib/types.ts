// src/lib/types.ts
export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    education: {
      degree: string;
      university: string;
      duration: string;
      details: string[];
    }[];
    skills: {
      category: string;
      items: string[];
    }[];
  }

  // Add to your existing types file (e.g., @/lib/types.ts)
export type JobDetails = {
  skills: string[];
  education: string[];
  experience: string;
  error?: string; // Optional error field
};

export interface EducationItem {
  degree: string;
  university: string;
  duration: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export type MatchResult = {
  [category: string]: string[]; // e.g., { "Programming": ["JavaScript", "TypeScript"] }
};

export type MissingResult = {
  [category: string]: string[]; // e.g., { "Programming": ["Python"] }
};
