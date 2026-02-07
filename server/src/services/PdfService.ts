import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { IPdfService } from '../interfaces/IPdfService';

export class PdfService implements IPdfService {
    async generatePdf(htmlContent: string): Promise<Buffer> {
        let browser;
        try {
            const isProduction = process.env.NODE_ENV === 'production';

            browser = await puppeteer.launch({
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
                headless: 'shell',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-zygote',
                    isProduction ? '--single-process' : undefined
                ].filter(Boolean) as string[]
            });
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
            });
            return Buffer.from(pdf);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            throw error;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}
