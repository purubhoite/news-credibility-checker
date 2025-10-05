import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

function getUserId(req: Request): string {
  // For now, simulate user id via header or default
  return (req.header('x-user-id') || 'demo-user').toString();
}

router.get('/history', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const items = await prisma.check.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { sources: true },
  });
  // Map DB -> API shape
  const result = items.map((c) => ({
    id: c.id,
    originalClaim: c.originalClaim,
    cleanedClaim: c.cleanedClaim,
    verdict: c.verdict as any,
    confidence: c.confidence,
    summary: c.summary,
    sources: c.sources,
    checkedAt: c.checkedAt.toISOString(),
    timestamp: c.createdAt.toISOString(),
  }));
  res.json(result);
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { id } = req.params;
  // Ensure it belongs to user
  const existing = await prisma.check.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) return res.status(404).json({ error: 'Not found' });
  await prisma.check.delete({ where: { id } });
  res.status(204).send();
});

export default router;


