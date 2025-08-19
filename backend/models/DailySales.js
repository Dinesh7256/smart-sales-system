// models/dailySales.js
import mongoose from 'mongoose';

const soldItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantitySold: {
        type: Number,
        required: true
    },
    sellingPrice: { // Store the price at the time of sale
        type: Number,
        required: true
    },
    costPrice: { // Store the cost at the time of sale
        type: Number,
        required: true
    }
});

const dailySalesSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    itemsSold: [soldItemSchema],
    totalDailyRevenue: {
        type: Number,
        required: true,
    },
    totalDailyProfit: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const DailySales = mongoose.model('DailySales', dailySalesSchema);

export default DailySales;