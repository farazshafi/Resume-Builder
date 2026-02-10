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

    async getAll(req: Request, res: Response) {
        try {
            const resumes = await this.resumeService.getAllResumes();
            res.status(200).json(resumes);
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
            const result = await this.resumeService.generatePdf(id);

            if (result.url) {
                // Prefer sending the buffer directly if we just generated it
                if (result.buffer) {
                    res.set({
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `inline; filename=resume.pdf`,
                        'Content-Length': result.buffer.length
                    });
                    return res.send(result.buffer);
                }

                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                return res.redirect(result.url);
            }

            if (result.buffer) {
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename=resume.pdf`,
                    'Content-Length': result.buffer.length
                });
                return res.send(result.buffer);
            }

            throw new Error('Failed to generate or retrieve PDF');
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await this.resumeService.deleteResume(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const resume = await this.resumeService.updateResume(id, req.body);
            res.status(200).json(resume);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async uploadAndGenerate(req: Request, res: Response) {
        try {
            console.log('Received upload request:', {
                hasFile: !!req.file,
                bodyKeys: Object.keys(req.body)
            });
            const { jobDescription } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No resume file uploaded' });
            }

            if (!jobDescription) {
                return res.status(400).json({ error: 'Job description is required' });
            }

            const resume = await this.resumeService.uploadAndGenerate(file.buffer, jobDescription);
            res.status(201).json(resume);
        } catch (error: any) {
            console.error('Upload and generate error:', error);
            res.status(500).json({ error: error.message || 'Error processing resume' });
        }
    }
}
