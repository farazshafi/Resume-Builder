import { Router, Request, Response } from 'express';
import { ResumeController } from '../controllers/ResumeController';
import { ResumeService } from '../services/ResumeService';
import { ResumeRepository } from '../repositories/ResumeRepository';
import { PdfService } from '../services/PdfService';
import { LlmService } from '../services/LlmService';

const router = Router();
const resumeRepository = new ResumeRepository();
const pdfService = new PdfService();
const llmService = new LlmService();
const resumeService = new ResumeService(resumeRepository, pdfService, llmService);
const resumeController = new ResumeController(resumeService);

router.post('/', (req: Request, res: Response) => resumeController.create(req, res));
router.get('/:id', (req: Request, res: Response) => resumeController.getById(req, res));
router.post('/:id/generate', (req: Request, res: Response) => resumeController.generate(req, res));
router.get('/:id/download', (req: Request, res: Response) => resumeController.downloadPdf(req, res));

export default router;
