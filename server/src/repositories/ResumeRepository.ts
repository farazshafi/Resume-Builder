import { IResumeRepository } from '../interfaces/IResumeRepository';
import { BaseRepository } from './BaseRepository';
import prisma from '../config/prisma';

export class ResumeRepository extends BaseRepository<any> implements IResumeRepository {
    constructor() {
        super(prisma, prisma.resume);
    }

    override async create(data: any): Promise<any> {
        const { id, createdAt, updatedAt, ...validData } = data;
        return super.create(validData);
    }

    override async update(id: string, data: any): Promise<any> {
        const { id: _, createdAt, updatedAt, ...validData } = data;
        return super.update(id, validData);
    }
}
