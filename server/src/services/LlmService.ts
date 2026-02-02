import { GoogleGenerativeAI } from '@google/generative-ai';
import { ILlmService } from '../interfaces/ILlmService';

export class LlmService implements ILlmService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || '';
        if (!apiKey) console.error('GEMINI_API_KEY is missing in .env');
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Using Gemini 2.0 Flash for speed and robustness
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    async tailorResume(resume: any, jobDescription: string): Promise<any> {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not found, returning original resume');
            return resume;
        }

        const prompt = `
      You are an expert career coach and ATS optimization specialist. 
      Your task is to tailor the provided resume DATA to the JOB DESCRIPTION using a SINGLE pass.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      RESUME DATA:
      ${JSON.stringify(resume, null, 2)}
      
      CRITICAL INSTRUCTIONS:
      1. SUMMARY: Generate a high-impact, professional 2-3 sentence summary (50-70 words) tailored to the job.
      2. EXPERIENCE: 
         - For EACH experience item, rewrite the bullets using the formula: Action Verb + Task + Impact. 
         - Integrate keywords from the job description naturally.
         - Maintain the original number of bullets unless they are completely irrelevant.
      3. PROJECTS: 
         - Analyze all projects provided.
         - Select and KEEP only the TOP 3 most relevant projects for this specific job.
         - COMPLETELY REMOVE projects that have zero relevance to the job requirements.
         - Optimize the bullets for the remaining projects.
      4. SKILLS:
         - REMOVE technical and soft skills that are unrelated to the target job.
         - Categorize technical skills into logical professional groups (e.g., "Frontend", "Backend", "Tools", "Cloud").
      5. PERSONAL INFO & EDUCATION: Keep exactly as provided.
      
      RETURN FORMAT:
      Return ONLY a valid JSON object matching the following structure. Do not include any markdown formatting like \`\`\`json.
      {
        "fullName": "...",
        "email": "...",
        "phone": "...",
        "location": "...",
        "linkedIn": "...",
        "website": "...",
        "summary": "...",
        "experience": [ { "company": "...", "role": "...", "duration": "...", "location": "...", "bullets": ["..."] } ],
        "projects": [ { "title": "...", "description": "...", "technologies": ["..."], "bullets": ["..."] } ],
        "skills": {
          "technical": { "Category1": ["skill1", "skill2"], "Category2": ["skill3"] },
          "soft": ["skill1", "skill2"]
        },
        "education": [ { "institution": "...", "degree": "...", "graduationDate": "...", "location": "..." } ]
      }
    `;

        try {
            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2, // Lower temperature for more consistent and structured JSON
                    topP: 0.8,
                    maxOutputTokens: 4096, // Increased to ensure long resumes aren't truncated
                },
            });

            const response = await result.response;
            const text = response.text().trim();

            // Extract JSON from potential markdown backticks or just parse directly
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed;
            }
            throw new Error('Could not parse JSON from AI response');
        } catch (error: any) {
            console.error('Gemini API Error in tailorResume:', error);
            if (error.message?.includes('limit: 0')) {
                throw new Error('AI Quota Error: Your API key has a "Limit 0" quota. Please ensure your project has a billing account or generate a new key.');
            }
            // Fallback to original resume if tailoring fails but log the error
            return resume;
        }
    }
}
