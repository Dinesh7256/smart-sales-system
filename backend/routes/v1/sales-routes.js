import express from 'express';
import { createDailySale, getSales } from '../../controllers/sales-controller.js';
import { authenticate } from '../../middlewares/authenticate.js';

const router = express.Router();


// Secure endpoint for creating daily sales
router.post('/', authenticate, createDailySale);

// Secure endpoint for fetching sales
router.get('/', authenticate, getSales);

export default router;
