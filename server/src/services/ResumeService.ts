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

    async generateTailoredResume(id: string, jobDescription: string): Promise<any> {
        const resume = await this.resumeRepository.findById(id);
        if (!resume) throw new Error('Resume not found');

        const exp = (resume.experience as any[]) || [];
        const optimizedExp = await Promise.all(
            exp.map(async (item) => ({
                ...item,
                bullets: await this.llmService.optimizeBullets(item.bullets || [], jobDescription)
            }))
        );

        const tailoredContent = {
            ...resume,
            targetJobDescription: jobDescription,
            generatedContent: {
                ...resume,
                experience: optimizedExp,
                summary: await this.llmService.generateSummary(resume, jobDescription)
            }
        };

        return this.resumeRepository.update(id, tailoredContent);
    }

    async generatePdf(id: string): Promise<Buffer> {
        const resume = await this.resumeRepository.findById(id);
        if (!resume) throw new Error('Resume not found');

        const html = resumeTemplate(resume);
        return this.pdfService.generatePdf(html);
    }
}
