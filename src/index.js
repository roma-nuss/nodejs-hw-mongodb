import express from 'express';
import dotenv from 'dotenv';
import { connectToMongo } from './db/initMongoConnection.js';
import contactsRoutes from './routes/contactsRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/contacts', contactsRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
  });
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    await connectToMongo();
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error('Failed to start the application:', error.message);
    process.exit(1);
  }
});
