import express from 'express';
import cors from 'cors';
import { config } from './config';
import { uploadDir } from './lib/upload';
import { healthRouter } from './routes/health';
import { categoryRouter } from './routes/categories';
import { productRouter } from './routes/products';
import { orderRouter } from './routes/orders';
import { accountRouter } from './routes/account';
import { adminRouter } from './routes/admin';
import { errorHandler, notFound } from './middleware/error';

export const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '100kb' }));
app.use('/uploads', express.static(uploadDir));

app.use(healthRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/account', accountRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);
