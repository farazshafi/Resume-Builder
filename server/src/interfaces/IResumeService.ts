export interface IResumeService {
    generateTailoredResume(userId: string, jobDescription: string): Promise<any>;
    getResumeById(id: string): Promise<any>;
    createResume(data: any): Promise<any>;
    generatePdf(id: string): Promise<Buffer>;
}
