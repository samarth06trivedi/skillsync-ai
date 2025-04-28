// src/lib/extractResumeData.ts
import { ResumeData } from '@/lib/types';
// src/lib/extractResumeData.ts  
  export function extractResumeData(text: string): ResumeData {
    // Extract name (before email)
    const nameMatch = text.match(/^([^\n@|<]+)/m);
  
    // Extract email and phone
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?\d{10}/);
  
    // Extract education section
    const educationSection = text.match(/Education\n([\s\S]*?)(?=\nSkills\n)/i)?.[1] || '';
    
    const eduLines = educationSection.split('\n').map(line => line.trim()).filter(line => line);
    const education = [];
    for (let i = 0; i < eduLines.length; i++) {
      const line = eduLines[i];
      if (line.match(/B\.Tech|12th|10th/i)) {
        const degree = line;
        let university = '';
        let duration = '';
        const details: string[] = [];
  
        // Look ahead
        if (eduLines[i + 1] && !eduLines[i + 1].match(/^\d{4}|CGPA|%/)) {
          university = eduLines[++i];
        }
        if (eduLines[i + 1] && (eduLines[i + 1].match(/^\d{4}/) || eduLines[i + 1].includes('CGPA') || eduLines[i + 1].includes('%'))) {
          duration = eduLines[++i];
        }
        if (eduLines[i + 1] && (eduLines[i + 1].includes('CGPA') || eduLines[i + 1].includes('%'))) {
          details.push(eduLines[++i]);
        }
  
        education.push({
          degree,
          university,
          duration,
          details
        });
      }
    }
  
    // Extract skills section

    const skillsSection = text.match(/Skills\n([\s\S]*?)(?=\nPersonal Projects|\nCertifications|$)/i)?.[1] || '';
    const skillLines = skillsSection.split(/\n/).map(line => line.trim()).filter(line => line);

    const skills: { category: string; items: string[] }[] = [];
    let currentCategory = '';
    let currentItems: string[] = [];

    for (const line of skillLines) {
    const inlineMatch = line.match(/^(.+?):\s*(.+)$/); // Matches "Category: item1, item2"
    
    if (inlineMatch) {
        // If a new category starts inline
        if (currentCategory) {
        skills.push({ category: currentCategory, items: currentItems });
        }
        currentCategory = inlineMatch[1].trim();
        currentItems = inlineMatch[2].split(',').map(item => item.trim());
    } else if (line.endsWith(':')) {
        // Line ends with ":", e.g., "Frontend:"
        if (currentCategory) {
        skills.push({ category: currentCategory, items: currentItems });
        }
        currentCategory = line.slice(0, -1).trim();
        currentItems = [];
    } else {
        // Otherwise treat line as item under current category
        currentItems.push(line.trim());
    }
    }
    // Push last collected category
    if (currentCategory) {
    skills.push({ category: currentCategory, items: currentItems });
    }

  
    return {
      name: nameMatch?.[1]?.trim() || 'Not found',
      email: emailMatch?.[0] || 'Not found',
      phone: phoneMatch?.[0] || 'Not found',
      education,
      skills
    };
  }
  