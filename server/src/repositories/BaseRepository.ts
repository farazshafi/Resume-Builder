import { IBaseRepository } from '../interfaces/IBaseRepository';
import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
    constructor(
        protected prisma: PrismaClient,
        protected model: any
    ) { }

    async create(data: any): Promise<T> {
        return this.model.create({ data });
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findUnique({ where: { id } });
    }

    async findAll(): Promise<T[]> {
        return this.model.findMany({
            orderBy: { updatedAt: 'desc' }
        });
    }

    async update(id: string, data: any): Promise<T> {
        return this.model.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<T> {
        return this.model.delete({ where: { id } });
    }
}
