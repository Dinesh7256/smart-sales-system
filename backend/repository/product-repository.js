import Product from '../models/product.js';
import CrudRepository from './crud-repositroy.js';

class ProductRepository extends CrudRepository {
    constructor() {
        super(Product);
    }

    // The create method is inherited from CrudRepository
    // Additional product-specific methods can be added here if needed

    async findByName(productName) {
        try {
            const response = await Product.findOne({ productName: productName });
            return response;
        } catch (error) {
            console.log("Something went wrong in product repo");
            throw error;
        }
    }

    async findByPriceRange(minPrice, maxPrice) {
        try {
            const response = await Product.find({
                costPrice: { $gte: minPrice, $lte: maxPrice }
            });
            return response;
        } catch (error) {
            console.log("Something went wrong in product repo");
            throw error;
        }
    }

    async getAllByUser(userId, productType = null) {
        try {
            // Base query - filter by user
            let query = { ownerId: userId };
            
            // Add product type filter if specified
            if (productType) {
                query.productType = productType;
            }
            
            const response = await Product.find(query);
            return response;
        } catch (error) {
            console.log("Something went wrong in product repo - getAllByUser");
            throw error;
        }
    }
}

export default new ProductRepository();
