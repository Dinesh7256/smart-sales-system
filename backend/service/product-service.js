import { productRepository } from '../repository/index.js';

class ProductService {
    constructor() {
        this.productRepository = productRepository;
    }

    async createProduct(data) {
        try {
            // Validate required fields
            if (!data.productName || !data.costPrice) {
                throw {
                    message: 'Product name and cost price are required'
                };
            }

            // Check if product already exists
            const existingProduct = await this.productRepository.findByName(data.productName);
            if (existingProduct) {
                throw {
                    message: 'Product with this name already exists'
                };
            }

            // Create the product
            const product = await this.productRepository.create(data);
            return product;
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

    async getAllProducts() {
        try {
            const products = await this.productRepository.getAll();
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
