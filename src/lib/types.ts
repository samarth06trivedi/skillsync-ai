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