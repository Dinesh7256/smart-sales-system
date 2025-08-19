import SalesService from '../service/sales-service.js';

const salesService = new SalesService();

export const createDailySale = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const itemsSold = req.body.itemsSold;
        if (!Array.isArray(itemsSold) || itemsSold.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'itemsSold must be a non-empty array',
                data: {},
                err: 'Bad Request'
            });
        }
        const dailySale = await salesService.createDailySale(ownerId, itemsSold);
        return res.status(201).json({
            success: true,
            message: 'Daily sales record created successfully',
            data: dailySale,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong',
            data: {},
            err: 'Internal Server Error'
        });
    }
};
