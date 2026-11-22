import express from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDb } from './db';
import { uploadDir } from './lib/upload';
import { Product } from './models/Product';
import { healthRouter } from './routes/health';
import { categoryRouter } from './routes/categories';
import { productRouter } from './routes/products';
import { orderRouter } from './routes/orders';
import { accountRouter } from './routes/account';
import { adminRouter } from './routes/admin';
import { errorHandler, notFound } from './middleware/error';

export const app = express();

let connecting: Promise<void> | null = null;

app.use(async (_req, _res, next) => {
  try {
    if (config.mongoUri) {
      if (!connecting) {
        connecting = (async () => {
          await connectDb();
          await Product.updateMany({ showOnHome: { $exists: false } }, { $set: { showOnHome: true } });
        })();
      }
      await connecting;
    }
    next();
  } catch (err) {
    connecting = null;
    next(err);
  }
});

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

export default app;
