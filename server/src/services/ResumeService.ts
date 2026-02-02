import { IResumeService } from '../interfaces/IResumeService';
import { IResumeRepository } from '../interfaces/IResumeRepository';
import { IPdfService } from '../interfaces/IPdfService';
import { ILlmService } from '../interfaces/ILlmService';
import { resumeTemplate } from '../utils/templates';

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

    async generatePdf(id: string): Promise<Buffer> {
        const resume = await this.resumeRepository.findById(id);
        if (!resume) throw new Error('Resume not found');

        const contentToRender = resume.generatedContent || resume;
        const html = resumeTemplate(contentToRender);
        return this.pdfService.generatePdf(html);
    }
}
