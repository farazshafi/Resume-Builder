import { IResumeService } from '../interfaces/IResumeService';
import { IResumeRepository } from '../interfaces/IResumeRepository';
import { IPdfService } from '../interfaces/IPdfService';
import { ILlmService } from '../interfaces/ILlmService';
import { resumeTemplate } from '../utils/templates';
const pdf = require('pdf-parse');

export class ResumeService implements IResumeService {
    constructor(
        private resumeRepository: IResumeRepository,
        private pdfService: IPdfService,
        private llmService: ILlmService
    ) { }

    async createResume(data: any): Promise<any> {
        return this.resumeRepository.create(data);
    }

    async getResumeById(id: string): Promise<any> {
        return this.resumeRepository.findById(id);
    }

    async getAllResumes(): Promise<any[]> {
        return this.resumeRepository.findAll();
    }

    async deleteResume(id: string): Promise<any> {
        return this.resumeRepository.delete(id);
    }

    async generateTailoredResume(id: string, jobDescription: string): Promise<any> {
        const resume = await this.resumeRepository.findById(id);
        if (!resume) throw new Error('Resume not found');

        const tailoredResume = await this.llmService.tailorResume(resume, jobDescription);

        const tailoredContent = {
            targetJobDescription: jobDescription,
            generatedContent: tailoredResume
        };

        return this.resumeRepository.update(id, tailoredContent);
    }

    async uploadAndGenerate(fileBuffer: Buffer, jobDescription: string): Promise<any> {
        // 1. Extract text from PDF
        let resumeText = '';
        try {
            const data = await pdf(fileBuffer);
            resumeText = data.text;
        } catch (err: any) {
            console.error('PDF parsing error Details:', err);
            throw new Error(`Failed to extract text from PDF: ${err.message}`);
        }

        // 2. Parse raw text into structured JSON using LLM
        // 2. Parse raw text into structured JSON using LLM
        let parsedResume = await this.llmService.parseResume(resumeText);

        // Sanitize parsed resume to remove common placeholders if LLM failed
        parsedResume = this.sanitizeResume(parsedResume);

        // 3. Save the initial parsed resume
        const savedResume = await this.resumeRepository.create(parsedResume);

        // 4. Generate tailored content
        const tailoredResume = await this.llmService.tailorResume(savedResume, jobDescription);

        // Ensure tailored resume keeps the (sanitized) original contact info
        tailoredResume.fullName = savedResume.fullName;
        tailoredResume.email = savedResume.email;
        tailoredResume.phone = savedResume.phone;
        tailoredResume.location = savedResume.location;
        tailoredResume.linkedIn = savedResume.linkedIn;
        tailoredResume.website = savedResume.website;
        tailoredResume.education = savedResume.education;

        // 5. Update with tailored content
        const tailoredContent = {
            targetJobDescription: jobDescription,
            generatedContent: tailoredResume
        };

        return this.resumeRepository.update(savedResume.id, tailoredContent);
    }

    private sanitizeResume(resume: any): any {
        const placeholders = [
            'hello@reallygreatsite.com',
            '123 anywhere st',
            'any city',
            '123-456-7890',
            'www.reallygreatsite.com'
        ];

        const isPlaceholder = (text: string) => {
            if (!text) return false;
            const lower = text.toLowerCase();
            return placeholders.some(p => lower.includes(p));
        };

        if (isPlaceholder(resume.email)) resume.email = '';
        if (isPlaceholder(resume.phone)) resume.phone = '';
        if (isPlaceholder(resume.location)) resume.location = '';
        if (isPlaceholder(resume.website)) resume.website = '';
        if (isPlaceholder(resume.linkedIn)) resume.linkedIn = '';

        return resume;
    }

    async generatePdf(id: string): Promise<Buffer> {
        const resume = await this.resumeRepository.findById(id);
        if (!resume) throw new Error('Resume not found');

        const contentToRender = resume.generatedContent || resume;
        const html = resumeTemplate(contentToRender);
        return this.pdfService.generatePdf(html);
    }
}
