import { IResumeService } from '../interfaces/IResumeService';
import { IResumeRepository } from '../interfaces/IResumeRepository';
import { IPdfService } from '../interfaces/IPdfService';
import { ILlmService } from '../interfaces/ILlmService';
import { resumeTemplate } from '../utils/templates';
import { v2 as cloudinary } from 'cloudinary';
const pdf = require('pdf-parse');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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

    async generatePdf(id: string): Promise<{ buffer?: Buffer, url?: string }> {
        const resume = await this.resumeRepository.findById(id);
        if (!resume) throw new Error('Resume not found');

        // Return existing URL if available (and skip legacy broken or 'raw' URLs)
        if (resume.pdfUrl && !resume.pdfUrl.includes('/raw/upload/') && !resume.pdfUrl.includes('/image/upload/')) {
            // We only trust the URL if it was uploaded with 'auto' (which Cloudinary represents differently sometimes)
            // But to be safe and clear the current error, let's force re-upload for all current URLs once
            // return { url: resume.pdfUrl };
        }
        // Force re-generation for now to fix the user's broken links

        const contentToRender = resume.generatedContent || resume;
        const html = resumeTemplate(contentToRender);
        const buffer = await this.pdfService.generatePdf(html);
        console.log(`Generated PDF buffer size for resume ${id}: ${buffer.length} bytes`);
        console.log(`Buffer start: ${buffer.slice(0, 10).toString('hex')} (${buffer.slice(0, 5).toString()})`);

        if (buffer.length < 100 || !buffer.toString().startsWith('%PDF-')) {
            throw new Error('Generated PDF is invalid or corrupted');
        }

        // Upload to Cloudinary and save URL
        try {
            const uploadPromise = new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'resumes',
                        resource_type: 'raw', // Instruction 1: Set resource_type to 'raw'
                        public_id: `resume_${id}.pdf`, // Instruction 2: Ensure public_id ends with .pdf
                        overwrite: true,
                        invalidate: true
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary internal error:', error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(buffer);
            });

            const result: any = await uploadPromise;
            await this.resumeRepository.update(id, { pdfUrl: result.secure_url });
            return { buffer, url: result.secure_url };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            // Fallback to returning buffer if upload fails
            return { buffer };
        }
    }
}
