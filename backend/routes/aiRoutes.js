const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getFinancialAnalysis,
  predictExpenses,
  analyzeSpending,
  getFinancialHealthScore
} = require('../controllers/aiPredictionController');

/**
 * @route   POST /api/v1/ai/analyze
 * @desc    Get comprehensive AI financial analysis with predictions and insights
 * @access  Private
 */
router.post('/analyze', protect, getFinancialAnalysis);

/**
 * @route   POST /api/v1/ai/predict-expenses
 * @desc    Predict next month's expenses
 * @access  Private
 */
router.post('/predict-expenses', protect, predictExpenses);

/**
 * @route   POST /api/v1/ai/analyze-spending
 * @desc    Analyze spending patterns and get recommendations
 * @access  Private
 */
router.post('/analyze-spending', protect, analyzeSpending);

/**
 * @route   GET /api/v1/ai/health-score
 * @desc    Get financial health score
 * @access  Private
 */
router.get('/health-score', protect, getFinancialHealthScore);

module.exports = router;
