export interface IPdfService {
    generatePdf(htmlContent: string): Promise<Buffer>;
}
