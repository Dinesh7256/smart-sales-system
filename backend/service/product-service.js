
import { productRepository } from '../repository/index.js';

class ProductService {
    constructor() {
        this.productRepository = productRepository;
    }

    async restockProduct(id, quantityToAdd) {
        const product = await this.productRepository.get(id);
        if (!product) {
            throw { message: 'Product not found' };
        }
        product.quantityInStock += quantityToAdd;
        await product.save();
        return product;
    }

    async createProduct(data) {
        try {
            // If data is an array, handle bulk insert
            if (Array.isArray(data)) {
                if (data.length === 0) {
                    throw { message: 'Product array cannot be empty' };
                }
                // Validate all items
                for (const item of data) {
                    if (!item.productName || !item.costPrice) {
                        throw { message: 'Product name and cost price are required' };
                    }
                }
                // Use insertMany for bulk insert (skip duplicate name check for performance)
                const products = await this.productRepository.model.insertMany(data);
                return products;
            } else {
                // Single product logic
                if (!data.productName || !data.costPrice) {
                    throw { message: 'Product name and cost price are required' };
                }
                const existingProduct = await this.productRepository.findByName(data.productName);
                if (existingProduct) {
                    throw { message: 'Product with this name already exists' };
                }
                const product = await this.productRepository.create(data);
                return product;
            }
        } catch(error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await this.productRepository.get(id);
            return product;
        } catch(error) {
            throw error;
        }
    }

    async getProductByName(productName) {
        try {
            const product = await this.productRepository.findByName(productName);
            return product;
        } catch(error) {
            throw error;
        }
    }

    async getProductsByPriceRange(minPrice, maxPrice) {
        try {
            const products = await this.productRepository.findByPriceRange(minPrice, maxPrice);
            return products;
        } catch(error) {
            throw error;
        }
    }

    async getAllProducts(userId, productType = null) {
        try {
            const products = await this.productRepository.getAllByUser(userId, productType);
            return products;
        } catch(error) {
            throw error;
        }
    }

    async updateProduct(id, data) {
        try {
            // Check if product exists
            const existingProduct = await this.productRepository.get(id);
            if (!existingProduct) {
                throw {
                    message: 'Product not found'
                };
            }

            // If updating product name, check for duplicates
            if (data.productName && data.productName !== existingProduct.productName) {
                const duplicateProduct = await this.productRepository.findByName(data.productName);
                if (duplicateProduct) {
                    throw {
                        message: 'Product with this name already exists'
                    };
                }
            }

            const updatedProduct = await this.productRepository.update(id, data);
            return updatedProduct;
        } catch(error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            // Check if product exists
            const existingProduct = await this.productRepository.get(id);
            if (!existingProduct) {
                throw {
                    message: 'Product not found'
                };
            }

            const deletedProduct = await this.productRepository.destroy(id);
            return deletedProduct;
        } catch(error) {
            throw error;
        }
    }
}

export default ProductService;
