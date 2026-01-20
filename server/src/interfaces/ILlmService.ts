export interface ILlmService {
    optimizeBullets(bullets: string[], jobDescription: string): Promise<string[]>;
    generateSummary(profile: any, jobDescription: string): Promise<string>;
}
