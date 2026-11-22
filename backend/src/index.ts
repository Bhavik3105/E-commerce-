import { app } from './app';
import { config } from './config';

async function main() {
  if (!config.mongoUri) {
    console.warn('MONGODB_URI is not set. The API will start, but catalogue and orders stay unavailable.');
  }

  app.listen(config.port, () => {
    console.log(`Jummip API listening on http://localhost:${config.port}`);
  });
}

export default app;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
