import express from 'express';
import { createDailySale } from '../../controllers/sales-controller.js';
import { authenticate } from '../../middlewares/authenticate.js';

const router = express.Router();

// Secure endpoint for creating daily sales
router.post('/', authenticate, createDailySale);

export default router;
