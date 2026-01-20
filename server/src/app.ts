import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import resumeRoutes from './routes/resumeRoutes';
import { connectRedis } from './config/redis';
import { rateLimiter } from './middlewares/rateLimiter';

dotenv.config();

const app = express();

connectRedis().catch(console.error);

app.use(helmet());
app.use(cors());
app.use(express.json());
// app.use(rateLimiter); // Keep disabled until Redis is confirmed running

app.use('/api/resumes', resumeRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default app;
