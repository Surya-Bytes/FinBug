const express = require('express');
const { scanBill } = require('../controllers/billScanController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Scan bill image and extract details
router.post('/scan', protect, upload.single('bill'), scanBill);

module.exports = router;
