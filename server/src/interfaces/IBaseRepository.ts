export interface IBaseRepository<T> {
    create(data: any): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    update(id: string, data: any): Promise<T>;
    delete(id: string): Promise<T>;
}
