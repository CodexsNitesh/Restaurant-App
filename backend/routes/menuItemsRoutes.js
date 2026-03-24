const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/menuItemController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMidlleware');

router.get('/', getAll);                                          // public
router.get('/:id', getOne);                                       // public
router.post('/', protect, upload.single('image'), create);
router.put('/:id', protect, upload.single('image'), update);
router.delete('/:id', protect, remove);
module.exports = router;