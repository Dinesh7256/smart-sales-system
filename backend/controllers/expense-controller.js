import ExpenseService from '../service/expense-service.js';

const expenseService = new ExpenseService();

export const createExpense = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { amount, description, date } = req.body;
        if (!amount || !description) {
            return res.status(400).json({
                success: false,
                message: 'Amount and description are required',
                data: {},
                err: 'Bad Request'
            });
        }
        const expense = await expenseService.createExpense({ amount, description, date: date || new Date(), ownerId });
        return res.status(201).json({
            success: true,
            message: 'Expense logged successfully',
            data: expense,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong',
            data: {},
            err: 'Internal Server Error'
        });
    }
};

export const getAllExpenses = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const expenses = await expenseService.getAllExpenses(ownerId);
        return res.status(200).json({
            success: true,
            message: 'Expenses fetched successfully',
            data: expenses,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong',
            data: {},
            err: 'Internal Server Error'
        });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const updateData = req.body;
        const updated = await expenseService.updateExpense(expenseId, updateData);
        return res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            data: updated,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong',
            data: {},
            err: 'Internal Server Error'
        });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        await expenseService.deleteExpense(expenseId);
        return res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
            data: {},
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong',
            data: {},
            err: 'Internal Server Error'
        });
    }
};
