export interface ILlmService {
    tailorResume(resume: any, jobDescription: string): Promise<any>;
    optimizeBullets?(bullets: string[], jobDescription: string): Promise<string[]>;
    generateSummary?(profile: any, jobDescription: string): Promise<string>;
    selectBestProjects?(projects: any[], jobDescription: string): Promise<any[]>;
    optimizeSkills?(skills: any, jobDescription: string): Promise<any>;
}
