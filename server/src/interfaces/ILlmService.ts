export interface ILlmService {
    optimizeBullets(bullets: string[], jobDescription: string): Promise<string[]>;
    generateSummary(profile: any, jobDescription: string): Promise<string>;
    selectBestProjects(projects: any[], jobDescription: string): Promise<any[]>;
    optimizeSkills(skills: { technical: string[], soft: string[] }, jobDescription: string): Promise<{ technical: Record<string, string[]>, soft: string[] }>;
}
