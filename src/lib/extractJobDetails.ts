export async function extractJobDetails(text: string) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000/upload", // Required for OpenRouter
                "X-Title": "SkillSync AI" // Optional but recommended
            },
            body: JSON.stringify({
                model: "tngtech/deepseek-r1t-chimera:free",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that extracts job details and returns ONLY valid JSON."
                    },
                    {
                        role: "user",
                        content: `
Extract the following details from this job description and return ONLY a JSON object:
{
    "skills": [array of technical skills mentioned],
    "education": [array of required degrees or certifications],
    "experience": "string describing required years of experience"
}

Job Description: ${text}

Important: Return ONLY the JSON object, no additional text or explanations.
                        `
                    }
                ],
                temperature: 0.3,
                response_format: { type: "json_object" } // Request JSON response
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        const output = result.choices?.[0]?.message?.content?.trim();

        if (!output) {
            throw new Error("Empty response from model");
        }

        // Try to parse directly first
        try {
            return JSON.parse(output);
        } catch  {
            // If direct parse fails, try extracting JSON
            const jsonMatch = output.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    return JSON.parse(jsonMatch[0]);
                } catch  {
                    console.error("Extracted JSON is invalid:", jsonMatch[0]);
                }
            }
            console.error("Failed to parse JSON:", output);
            throw new Error("Model returned invalid JSON");
        }

    } catch (error) {
        console.error("Error in extractJobDetails:", error);
        return {
            skills: [],
            education: [],
            experience: "",
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}