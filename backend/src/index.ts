import { app } from './app';
import { config } from './config';
import { connectDb } from './db';
import { Product } from './models/Product';

async function main() {
  if (!config.mongoUri) {
    console.warn('MONGODB_URI is not set. The API will start, but catalogue and orders stay unavailable.');
  } else {
    await connectDb();
    await Product.updateMany({ showOnHome: { $exists: false } }, { $set: { showOnHome: true } });
    console.log('Connected to MongoDB');
  }

  app.listen(config.port, () => {
    console.log(`Jummip API listening on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
