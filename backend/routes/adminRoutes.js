const express = require('express');
const router = express.Router();
const { login, setup } = require('../controllers/adminController');

router.post('/login', login);
router.post('/setup', setup); // Run once to create admin
module.exports = router;