const express = require('express');
const router = express.Router();
const { get, update } = require('../controllers/settingsController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMidlleware');

router.get('/', get);     // public (menu page needs restaurant name/logo)
router.put('/', protect, upload.fields([{ name: 'logo' }, { name: 'banner' }]), update);
module.exports = router;