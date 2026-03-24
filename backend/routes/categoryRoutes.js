const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getAll);                      // public
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);
module.exports = router;