import express from 'express';
import { signup } from '../../controllers/auth-controller.js';
import { login } from '../../controllers/auth-controller.js';
import { forgotPassword } from '../../controllers/auth-controller.js';
import { resetPassword } from '../../controllers/auth-controller.js';
import productRoutes from './product-routes.js';

const router = express.Router();

// Authentication routes (public)
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Product routes (protected)
router.use('/products', productRoutes);

export default router;