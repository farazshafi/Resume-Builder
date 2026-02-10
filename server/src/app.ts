import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import resumeRoutes from './routes/resumeRoutes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/resumes', resumeRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default app;
