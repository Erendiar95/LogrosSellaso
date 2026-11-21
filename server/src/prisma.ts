import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

app.use(cors({ origin: process.env.FRONTEND_URL }));