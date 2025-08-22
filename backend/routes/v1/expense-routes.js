import express from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { createExpense, getAllExpenses, updateExpense, deleteExpense } from '../../controllers/expense-controller.js';

const router = express.Router();

router.post('/', authenticate, createExpense);
router.get('/', authenticate, getAllExpenses);
router.put('/:id', authenticate, updateExpense);
router.delete('/:id', authenticate, deleteExpense);

export default router;
