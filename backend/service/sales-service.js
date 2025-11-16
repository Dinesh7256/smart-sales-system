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
                
                let revenue, profit, stockToDeduct, actualQuantitySold;
                
                // Smart Sales Calculator Logic
                if (item.saleType === 'price') {
                    // Customer pays specific rupee amount - use totalAmount directly
                    revenue = item.totalAmount;
                    
                    if (product.productType === 'weight') {
                        // Calculate quantity from price for weight products
                        const quantityInKg = revenue / product.sellingPrice;
                        actualQuantitySold = quantityInKg * 1000; // Convert to grams for display
                        stockToDeduct = quantityInKg; // Stock is in kg
                        profit = revenue - (quantityInKg * product.costPrice);
                    } else {
                        // Calculate quantity from price for unit products
                        actualQuantitySold = revenue / product.sellingPrice;
                        stockToDeduct = actualQuantitySold;
                        profit = revenue - (actualQuantitySold * product.costPrice);
                    }
                } else if (item.saleType === 'grams') {
                    // Customer buys specific grams
                    actualQuantitySold = item.quantitySold;
                    const quantityInKg = actualQuantitySold / 1000;
                    stockToDeduct = quantityInKg;
                    revenue = quantityInKg * product.sellingPrice;
                    profit = (product.sellingPrice - product.costPrice) * quantityInKg;
                } else if (item.saleType === 'kg') {
                    // Customer buys specific kilograms
                    const quantityInKg = item.quantitySold;
                    actualQuantitySold = quantityInKg * 1000;
                    stockToDeduct = quantityInKg;
                    revenue = quantityInKg * product.sellingPrice;
                    profit = (product.sellingPrice - product.costPrice) * quantityInKg;
                } else {
                    // Default: treat as unit sale or legacy format
                    if (product.productType === 'weight') {
                        // For weight products, quantitySold is in grams
                        actualQuantitySold = item.quantitySold;
                        const quantityInKg = actualQuantitySold / 1000;
                        stockToDeduct = quantityInKg;
                        revenue = quantityInKg * product.sellingPrice;
                        profit = (product.sellingPrice - product.costPrice) * quantityInKg;
                    } else {
                        // For unit products
                        actualQuantitySold = item.quantitySold;
                        stockToDeduct = actualQuantitySold;
                        revenue = actualQuantitySold * product.sellingPrice;
                        profit = (product.sellingPrice - product.costPrice) * actualQuantitySold;
                    }
                }
                
                // Check stock availability
                if (product.quantityInStock < stockToDeduct) {
                    const unit = product.productType === 'weight' ? 'kg' : 'units';
                    throw new Error(`Insufficient stock for ${product.productName}. Available: ${product.quantityInStock} ${unit}, Required: ${stockToDeduct.toFixed(3)} ${unit}`);
                }
                
                totalDailyRevenue += revenue;
                totalDailyProfit += profit;
                
                // Update stock
                product.quantityInStock -= stockToDeduct;
                await product.save({ session });
                
                soldItems.push({
                    productId: product._id,
                    quantitySold: actualQuantitySold,
                    sellingPrice: product.sellingPrice,
                    costPrice: product.costPrice,
                    saleType: item.saleType || 'unit',
                    revenue: revenue,
                    stockDeducted: stockToDeduct
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
            
            let revenue, profit, stockToDeduct, actualQuantitySold;
            
            // Smart Sales Calculator Logic
            if (item.saleType === 'price') {
                // Customer pays specific rupee amount - use totalAmount directly
                revenue = item.totalAmount;
                
                if (product.productType === 'weight') {
                    // Calculate quantity from price for weight products
                    const quantityInKg = revenue / product.sellingPrice;
                    actualQuantitySold = quantityInKg * 1000; // Convert to grams for display
                    stockToDeduct = quantityInKg; // Stock is in kg
                    profit = revenue - (quantityInKg * product.costPrice);
                } else {
                    // Calculate quantity from price for unit products
                    actualQuantitySold = revenue / product.sellingPrice;
                    stockToDeduct = actualQuantitySold;
                    profit = revenue - (actualQuantitySold * product.costPrice);
                }
            } else if (item.saleType === 'grams') {
                // Customer buys specific grams
                actualQuantitySold = item.quantitySold;
                const quantityInKg = actualQuantitySold / 1000;
                stockToDeduct = quantityInKg;
                revenue = quantityInKg * product.sellingPrice;
                profit = (product.sellingPrice - product.costPrice) * quantityInKg;
            } else if (item.saleType === 'kg') {
                // Customer buys specific kilograms
                const quantityInKg = item.quantitySold;
                actualQuantitySold = quantityInKg * 1000;
                stockToDeduct = quantityInKg;
                revenue = quantityInKg * product.sellingPrice;
                profit = (product.sellingPrice - product.costPrice) * quantityInKg;
            } else {
                // Default: treat as unit sale or legacy format
                if (product.productType === 'weight') {
                    // For weight products, quantitySold is in grams
                    actualQuantitySold = item.quantitySold;
                    const quantityInKg = actualQuantitySold / 1000;
                    stockToDeduct = quantityInKg;
                    revenue = quantityInKg * product.sellingPrice;
                    profit = (product.sellingPrice - product.costPrice) * quantityInKg;
                } else {
                    // For unit products
                    actualQuantitySold = item.quantitySold;
                    stockToDeduct = actualQuantitySold;
                    revenue = actualQuantitySold * product.sellingPrice;
                    profit = (product.sellingPrice - product.costPrice) * actualQuantitySold;
                }
            }
            
            // Check stock availability
            if (product.quantityInStock < stockToDeduct) {
                const unit = product.productType === 'weight' ? 'kg' : 'units';
                throw new Error(`Insufficient stock for ${product.productName}. Available: ${product.quantityInStock} ${unit}, Required: ${stockToDeduct.toFixed(3)} ${unit}`);
            }
            
            totalDailyRevenue += revenue;
            totalDailyProfit += profit;
            
            // Update stock
            product.quantityInStock -= stockToDeduct;
            await product.save();
            
            soldItems.push({
                productId: product._id,
                quantitySold: actualQuantitySold,
                sellingPrice: product.sellingPrice,
                costPrice: product.costPrice,
                saleType: item.saleType || 'unit',
                revenue: revenue,
                stockDeducted: stockToDeduct
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
