import { GoogleGenerativeAI } from '@google/generative-ai';
import { ILlmService } from '../interfaces/ILlmService';

export class LlmService implements ILlmService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async optimizeBullets(bullets: string[], jobDescription: string): Promise<string[]> {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not found, returning original bullets');
            return bullets;
        }

        const prompt = `
      You are an expert resume writer and career coach. 
      Target Job Description: ${jobDescription}
      
      Rewrite the following resume bullet points to be more "humanized", achievement-oriented, and ATS-friendly. 
      Follow the formula: Action Verb + Task + Impact. 
      Align the wording with the keywords and responsibilities in the job description without lying.
      
      Bullets:
      ${bullets.join('\n')}
      
      Return ONLY the optimized bullet points, one per line, starting with a dash.
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return text.split('\n').filter((line: string) => line.trim().startsWith('-')).map((line: string) => line.replace(/^- /, '').trim());
        } catch (error) {
            console.error('Gemini API Error:', error);
            return bullets;
        }
    }

    async generateSummary(profile: any, jobDescription: string): Promise<string> {
        if (!process.env.GEMINI_API_KEY) {
            return `Results-oriented professional with experience tailored for this role.`;
        }

        const prompt = `
      Generate a professional 2-3 sentence resume summary for a candidate with the following skills and background, tailored specifically for this job description.
      
      Candidate Background: ${JSON.stringify(profile)}
      Job Description: ${jobDescription}
      
      Make it sound human, professional, and natural. Return ONLY the text of the summary.
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Gemini API Error:', error);
            return 'Professional dedicated to achieving excellence and contributing value in high-impact projects.';
        }
    }
}
