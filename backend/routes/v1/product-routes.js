
import express from 'express';
import { 
    addProduct, 
    getProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct, 
    getProductsByPriceRange, 
    restockProduct 
} from '../../controllers/product-controller.js';
import { authenticate } from '../../middlewares/authenticate.js';

const router = express.Router();

// PATCH /api/v1/products/:id/restock - Restock a product
router.patch('/:id/restock', authenticate, restockProduct);

// All product routes require authentication
// POST /api/v1/products - Create a new product
router.post('/', authenticate, addProduct);

// GET /api/v1/products - Get all products
router.get('/', authenticate, getAllProducts);

// GET /api/v1/products/search - Get products by price range
// This route must come before /:id to avoid conflicts
router.get('/search', authenticate, getProductsByPriceRange);

// GET /api/v1/products/:id - Get a specific product
router.get('/:id', authenticate, getProduct);

// PUT /api/v1/products/:id - Update a product
router.put('/:id', authenticate, updateProduct);

// DELETE /api/v1/products/:id - Delete a product
router.delete('/:id', authenticate, deleteProduct);

export default router;
