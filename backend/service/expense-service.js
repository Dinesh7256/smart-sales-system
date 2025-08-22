import expenseRepository from '../repository/expense-repository.js';

class ExpenseService {
    async createExpense(data) {
        return await expenseRepository.create(data);
    }
    async getAllExpenses(ownerId) {
        return await expenseRepository.getAllByOwner(ownerId);
    }
    async getExpenseById(id) {
        return await expenseRepository.getById(id);
    }
    async updateExpense(id, data) {
        return await expenseRepository.update(id, data);
    }
    async deleteExpense(id) {
        return await expenseRepository.delete(id);
    }
}

export default ExpenseService;
