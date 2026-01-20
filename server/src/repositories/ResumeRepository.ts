import { IResumeRepository } from '../interfaces/IResumeRepository';
import prisma from '../config/prisma';

export class ResumeRepository implements IResumeRepository {
    async create(data: any): Promise<any> {
        return prisma.resume.create({ data });
    }

    async findById(id: string): Promise<any> {
        return prisma.resume.findUnique({ where: { id } });
    }

    async update(id: string, data: any): Promise<any> {
        return prisma.resume.update({
            where: { id },
            data
        });
    }
}
