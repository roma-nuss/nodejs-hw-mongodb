import dotenv from 'dotenv';
import { setupServer } from './server.js';
import { connectToMongo } from './db/initMongoConnection.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectToMongo();
    const app = setupServer();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error.message);
    process.exit(1);
  }
})();
