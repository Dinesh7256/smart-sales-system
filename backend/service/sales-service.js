import mongoose from 'mongoose';
import DailySales from '../models/DailySales.js';
import Product from '../models/product.js';

class SalesService {
    /**
     * Get all sales for a specific user
     * @param {String} ownerId - The user ID
     * @returns {Array} List of DailySales documents
     */
    async getSalesByOwner(ownerId) {
        return DailySales.find({ ownerId }).sort({ date: -1 });
    }
    /**
     * Create a daily sales record and update product stock atomically
     * @param {String} ownerId - The user ID
     * @param {Array} itemsSold - Array of { productId, quantitySold }
     * @returns {Object} The created DailySales document
     */
    async createDailySale(ownerId, itemsSold) {
        // Try with transaction first, fallback to non-transactional if not supported
        try {
            return await this._createDailySaleWithTransaction(ownerId, itemsSold);
        } catch (err) {
            if (err.message && err.message.includes('Transaction numbers are only allowed')) {
                // Fallback to non-transactional logic
                return await this._createDailySaleWithoutTransaction(ownerId, itemsSold);
            }
            throw err;
        }
    }

    async _createDailySaleWithTransaction(ownerId, itemsSold) {
        const session = await mongoose.startSession();
        try {
            await session.startTransaction();
            let totalDailyRevenue = 0;
            let totalDailyProfit = 0;
            const soldItems = [];

            for (const item of itemsSold) {
                const product = await Product.findById(item.productId).session(session);
                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }
                if (product.quantityInStock < item.quantitySold) {
                    throw new Error(`Insufficient stock for product: ${product.productName}`);
                }
                const revenue = product.sellingPrice * item.quantitySold;
                const profit = (product.sellingPrice - product.costPrice) * item.quantitySold;
                totalDailyRevenue += revenue;
                totalDailyProfit += profit;
                product.quantityInStock -= item.quantitySold;
                await product.save({ session });
                soldItems.push({
                    productId: product._id,
                    quantitySold: item.quantitySold,
                    sellingPrice: product.sellingPrice,
                    costPrice: product.costPrice
                });
            }
            const dailySale = await DailySales.create([
                {
                    date: new Date(),
                    ownerId,
                    itemsSold: soldItems,
                    totalDailyRevenue,
                    totalDailyProfit
                }
            ], { session });
            await session.commitTransaction();
            session.endSession();
            return dailySale[0];
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async _createDailySaleWithoutTransaction(ownerId, itemsSold) {
        let totalDailyRevenue = 0;
        let totalDailyProfit = 0;
        const soldItems = [];
        for (const item of itemsSold) {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }
            if (product.quantityInStock < item.quantitySold) {
                throw new Error(`Insufficient stock for product: ${product.productName}`);
            }
            const revenue = product.sellingPrice * item.quantitySold;
            const profit = (product.sellingPrice - product.costPrice) * item.quantitySold;
            totalDailyRevenue += revenue;
            totalDailyProfit += profit;
            product.quantityInStock -= item.quantitySold;
            await product.save();
            soldItems.push({
                productId: product._id,
                quantitySold: item.quantitySold,
                sellingPrice: product.sellingPrice,
                costPrice: product.costPrice
            });
        }
        const dailySale = await DailySales.create({
            date: new Date(),
            ownerId,
            itemsSold: soldItems,
            totalDailyRevenue,
            totalDailyProfit
        });
        return dailySale;
    }
}

export default SalesService;
