import Expense from '../models/expense.js';

class ExpenseRepository {
    async create(data) {
        return await Expense.create(data);
    }
    async getAllByOwner(ownerId) {
        return await Expense.find({ ownerId }).sort({ date: -1 });
    }
    async getById(id) {
        return await Expense.findById(id);
    }
    async update(id, data) {
        return await Expense.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return await Expense.findByIdAndDelete(id);
    }
}

export default new ExpenseRepository();
