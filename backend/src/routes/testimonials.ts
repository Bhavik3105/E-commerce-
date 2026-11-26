import { Router } from 'express';
import { requireDb } from '../middleware/error';
import { Testimonial, toPublicTestimonial } from '../models/Testimonial';

export const testimonialRouter = Router();

testimonialRouter.get('/', requireDb, async (_req, res, next) => {
  try {
    const notes = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ data: notes.map((note) => toPublicTestimonial(note)) });
  } catch (err) {
    next(err);
  }
});
