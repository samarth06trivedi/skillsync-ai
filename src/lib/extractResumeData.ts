import { ResumeData , EducationItem , SkillCategory } from '@/lib/types';

function cleanResumeText(text: string): string {
  return text
    // Remove links that might confuse the parser
    .replace(/(Deployment|Code|Certificate) Link/g, '')
    // Normalize section headers
    .replace(/\nSKILLS/g, '\n=== SKILLS ===')
    .replace(/\nPROJECTS/g, '\n=== PROJECTS ===')
    .replace(/\nEDUCATION/g, '\n=== EDUCATION ===')
    .replace(/\nCERTIFICATIONS/g, '\n=== CERTIFICATIONS ===')
    // Remove empty lines
    .replace(/^\s*[\r\n]/gm, '');
}

export async function extractResumeData(text: string): Promise<ResumeData> {
  try {
    const cleanedText = cleanResumeText(text);
    console.log("Processing resume text (length:", cleanedText.length, ")");

    const prompt = `
Extract the following details from this resume. Follow these rules:
1. Extract only the requested fields
2. Group skills by category
3. For education, include degree, university and duration
4. Return ONLY valid JSON with these exact keys:

{
  "name": "Full name from header",
  "email": "Email from contact info",
  "phone": "Phone number if available",
  "skills": [
    {
      "category": "Category name",
      "items": ["skill1", "skill2"]
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "university": "University name",
      "duration": "Time period"
    }
  ]
}

Resume Text:
${cleanedText.substring(0, 6000)} ${cleanedText.length > 6000 ? "\n...[truncated]..." : ""}

IMPORTANT: Return ONLY the JSON object. Do not include any explanations.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000/upload",
        "X-Title": "SkillSync AI"
      },
      body: JSON.stringify({
        model: "tngtech/deepseek-r1t-chimera:free",
        messages: [
          {
            role: "system",
            content: "You are a resume parsing assistant. Extract structured data and return ONLY valid JSON and no other extra text after or before the starting and ending {}."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2, // Lower temperature for more consistent results
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error:", {
        status: response.status,
        body: errorBody
      });
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Empty response from model");
    }

    // Debug log the raw response
    // console.log("Raw API response:", content);

    try {
      const parsed = JSON.parse(content);
      
      // Validate and transform the response
      return {
        name: parsed.name?.trim() || "Not found",
        email: parsed.email?.trim() || "Not found",
        phone: parsed.phone?.trim() || "Not found",
        education: Array.isArray(parsed.education) 
          ? parsed.education.map((edu: EducationItem) => ({
              degree: edu.degree?.trim() || "",
              university: edu.university?.trim() || "",
              duration: edu.duration?.trim() || ""
            }))
          : [],
        skills: Array.isArray(parsed.skills)
          ? parsed.skills.map((skillCat: SkillCategory) => ({
              category: skillCat.category?.trim() || "Other",
              items: Array.isArray(skillCat.items) 
                ? skillCat.items.map((item: string) => item?.trim()).filter(Boolean)
                : []
            }))
          : []
      };
    } catch (e) {
      console.error("JSON parsing error:", e);
      // Try to extract JSON from malformed response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch  {
          console.error("Failed to parse extracted JSON:", jsonMatch[0]);
        }
      }
      throw new Error("Failed to parse model response as JSON");
    }
  } catch (error) {
    console.error("Error in extractResumeData:", error);
    return {
      name: "Error: Parsing failed",
      email: "",
      phone: "",
      education: [],
      skills: []
    };
  }
}