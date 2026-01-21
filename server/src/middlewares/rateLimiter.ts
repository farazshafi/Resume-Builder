import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.ENABLE_REDIS !== 'true') {
        return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const key = `ratelimit:${ip}`;

    try {
        const requests = await redisClient.incr(key);
        if (requests === 1) {
            await redisClient.expire(key, 60); // 1 minute window
        }

        if (requests > 20) { // Limit to 20 requests per minute
            return res.status(429).json({ error: 'Too many requests' });
        }

        next();
    } catch (error) {
        next(); // Fallback if redis is down
    }
};
