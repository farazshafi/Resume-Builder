import { Request, Response } from 'express';
import { IResumeService } from '../interfaces/IResumeService';

export class ResumeController {
    constructor(private resumeService: IResumeService) { }

    async create(req: Request, res: Response) {
        try {
            const resume = await this.resumeService.createResume(req.body);
            res.status(201).json(resume);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const resume = await this.resumeService.getResumeById(id);
            if (!resume) return res.status(404).json({ error: 'Resume not found' });
            res.status(200).json(resume);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async generate(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { jobDescription } = req.body;
            const resume = await this.resumeService.generateTailoredResume(id, jobDescription);
            res.status(200).json(resume);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async downloadPdf(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const pdf = await this.resumeService.generatePdf(id);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=resume.pdf`,
                'Content-Length': pdf.length
            });
            res.send(pdf);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
