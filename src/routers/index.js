//src/routers/index.js
import { Router } from 'express';
import contactsRouter from './contactsRoutes.js';
import authRouter from './authRoutes.js';
const router = Router();
router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);
export default router;
