export const restockProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { quantityToAdd } = req.body;
        if (!quantityToAdd || isNaN(quantityToAdd) || quantityToAdd <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid quantityToAdd is required',
                data: {},
                err: 'Bad Request'
            });
        }
        const updated = await productService.restockProduct(productId, Number(quantityToAdd));
        return res.status(200).json({
            success: true,
            message: 'Product restocked successfully',
            data: updated,
            err: {}
        });
    } catch (error) {
        return sendErrorResponse(res, error);
    }
};
import ProductService from "../service/product-service.js";

const productService = new ProductService();

const sendErrorResponse = (res, error) => {
    console.error("Product API Error:", error.message);
    return res.status(500).json({
        success: false,
        message: error.message || 'Something went wrong',
        data: {},
        err: 'Internal Server Error'
    });
};

export const addProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        let productData = req.body;
        // If array, add ownerId to each
        if (Array.isArray(productData)) {
            productData = productData.map(item => ({
                ...item,
                ownerId: userId
            }));
        } else {
            productData = {
                ...productData,
                ownerId: userId
            };
        }

        const response = await productService.createProduct(productData);
        return res.status(201).json({
            success: true,
            message: Array.isArray(response) ? 'Successfully created products' : 'Successfully created a new product',
            data: response,
            err: {}
        });
    } catch(error) {
        if (error.message === 'Product name and cost price are required' || 
            error.message === 'Product with this name already exists' ||
            error.message === 'Product array cannot be empty') {
            return res.status(400).json({
                success: false,
                message: error.message,
                data: {},
                err: 'Bad Request'
            });
        }
        return sendErrorResponse(res, error);
    }
};

export const getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const response = await productService.getProductById(productId);
        
        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
                data: {},
                err: 'Not Found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved product',
            data: response,
            err: {}
        });
    } catch(error) {
        return sendErrorResponse(res, error);
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const response = await productService.getAllProducts();
        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved all products',
            data: response,
            err: {}
        });
    } catch(error) {
        return sendErrorResponse(res, error);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;
        
        const updateData = {
            ...req.body,
            updatedBy: userId
        };

        const response = await productService.updateProduct(productId, updateData);
        return res.status(200).json({
            success: true,
            message: 'Successfully updated product',
            data: response,
            err: {}
        });
    } catch(error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({
                success: false,
                message: error.message,
                data: {},
                err: 'Not Found'
            });
        }
        if (error.message === 'Product with this name already exists') {
            return res.status(400).json({
                success: false,
                message: error.message,
                data: {},
                err: 'Bad Request'
            });
        }
        return sendErrorResponse(res, error);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const response = await productService.deleteProduct(productId);
        
        return res.status(200).json({
            success: true,
            message: 'Successfully deleted product',
            data: response,
            err: {}
        });
    } catch(error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({
                success: false,
                message: error.message,
                data: {},
                err: 'Not Found'
            });
        }
        return sendErrorResponse(res, error);
    }
};

export const getProductsByPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        
        if (!minPrice || !maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'Both minPrice and maxPrice are required',
                data: {},
                err: 'Bad Request'
            });
        }

        const response = await productService.getProductsByPriceRange(
            parseFloat(minPrice), 
            parseFloat(maxPrice)
        );
        
        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved products by price range',
            data: response,
            err: {}
        });
    } catch(error) {
        return sendErrorResponse(res, error);
    }
};
