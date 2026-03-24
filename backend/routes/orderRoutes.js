const express = require('express');
const router = express.Router();
const { getAll, getOne, create, updateStatus, getStats, getDailyRevenue } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', create);                            // public (customer places order)
router.get('/', protect, getAll);
router.get('/stats', protect, getStats);
router.get('/revenue/daily', protect, getDailyRevenue);
router.get('/:id', protect, getOne);
router.patch('/:id/status', protect, updateStatus);
module.exports = router;