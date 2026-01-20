export interface IResumeRepository {
    create(data: any): Promise<any>;
    findById(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
}
