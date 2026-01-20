import puppeteer from 'puppeteer';
import { IPdfService } from '../interfaces/IPdfService';

export class PdfService implements IPdfService {
    async generatePdf(htmlContent: string): Promise<Buffer> {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
        });
        await browser.close();
        return Buffer.from(pdf);
    }
}
