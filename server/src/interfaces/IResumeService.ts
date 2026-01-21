export interface IResumeService {
    generateTailoredResume(userId: string, jobDescription: string): Promise<any>;
    getResumeById(id: string): Promise<any>;
    getAllResumes(): Promise<any[]>;
    createResume(data: any): Promise<any>;
    deleteResume(id: string): Promise<any>;
    generatePdf(id: string): Promise<Buffer>;
}
