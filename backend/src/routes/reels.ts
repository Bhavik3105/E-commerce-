import { Router } from 'express';
import { requireDb } from '../middleware/error';
import { Reel, toPublicReel } from '../models/Reel';

export const reelRouter = Router();

reelRouter.get('/', requireDb, async (_req, res, next) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json({ data: reels.map((reel) => toPublicReel(reel)) });
  } catch (err) {
    next(err);
  }
});
