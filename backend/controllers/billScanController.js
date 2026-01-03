const { scanBillImage } = require('../services/billScanService');

const scanBill = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const result = await scanBillImage(req.file.buffer, req.file.mimetype);

        if (result.success) {
            res.status(200).json({
                message: 'Bill scanned successfully',
                data: result.data
            });
        } else {
            res.status(500).json({
                message: result.error || 'Failed to scan bill'
            });
        }
    } catch (error) {
        console.error('Error in scanBill controller:', error);
        res.status(500).json({
            message: error.message || 'Failed to scan bill'
        });
    }
};

module.exports = { scanBill };
