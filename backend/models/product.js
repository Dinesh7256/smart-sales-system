import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    costPrice: {
        type: Number,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    quantityInStock: {
        type: Number,
        required: true,
        default: 0,
        // For 'weight' products, this will now mean total grams/ml
    },
    sellingPrice: {
        type: Number,
        required: true,
        // For 'weight' products, this will now mean price per KG/Liter
    },
    
    // --- NEW FIELDS FOR SMART SALES PAD ---
    productType: {
        type: String,
        enum: ['unit', 'weight'], // Can only be one of these two
        required: true,
        default: 'unit', // This ensures all existing products are treated as unit products
    },
    baseUnit: {
        type: String,
        enum: ['gram', 'ml'], // The base unit for 'weight' type products
        default: 'gram',
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;