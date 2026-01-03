const Income = require("../models/Income");
const Expense = require("../models/Expense");
const {
  generateFinancialAnalysis,
  predictNextMonthExpenses,
  analyzeSpendingPatterns,
} = require("../services/geminiService");
const {
  prepareFinancialDataForAI,
  hasMinimumDataForAnalysis,
} = require("../utils/aiDataPreparation");

/**
 * Get comprehensive AI financial analysis
 * @route POST /api/v1/ai/analyze
 * @access Protected
 */
exports.getFinancialAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all user transactions
    const expenses = await Expense.find({ userId }).sort({ date: -1 }).lean();
    const incomes = await Income.find({ userId }).sort({ date: -1 }).lean();

    // Check if user has minimum data for analysis
    if (!hasMinimumDataForAnalysis(expenses, incomes)) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const recentExpenses = expenses.filter(
        (e) => new Date(e.date) >= threeMonthsAgo,
      );
      const recentIncome = incomes.filter(
        (i) => new Date(i.date) >= threeMonthsAgo,
      );

      return res.status(200).json({
        success: true,
        insufficientData: true,
        message:
          "You need at least 10 expense transactions and 3 income entries from the last 3 months for AI analysis.",
        currentData: {
          expenseCount: expenses.length,
          incomeCount: incomes.length,
          recentExpenses: recentExpenses.length,
          recentIncome: recentIncome.length,
          threeMonthsAgo: threeMonthsAgo,
        },
        recommendations: [
          "Continue tracking your expenses for at least 3 months",
          "Add more transaction details to get better insights",
          "Ensure you have income records to enable budget analysis",
        ],
      });
    }

    // Prepare data for AI analysis
    const financialData = prepareFinancialDataForAI(expenses, incomes);

    // Generate AI analysis
    const aiAnalysis = await generateFinancialAnalysis(financialData);

    res.status(200).json({
      success: true,
      insufficientData: false,
      analysis: aiAnalysis.data,
      metadata: {
        generatedAt: aiAnalysis.generatedAt,
        dataRange: financialData.summary.dataQuality.dateRange,
        totalTransactions: financialData.summary.dataQuality.totalTransactions,
      },
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI analysis",
      error: error.message,
    });
  }
};

/**
 * Predict next month expenses
 * @route POST /api/v1/ai/predict-expenses
 * @access Protected
 */
exports.predictExpenses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch expense data
    const expenses = await Expense.find({ userId }).sort({ date: -1 }).lean();

    if (expenses.length < 10) {
      return res.status(200).json({
        success: true,
        insufficientData: true,
        message: "Need at least 10 expense transactions for prediction",
        currentCount: expenses.length,
      });
    }

    // Prepare expense data
    const incomes = await Income.find({ userId }).sort({ date: -1 }).lean();
    const financialData = prepareFinancialDataForAI(expenses, incomes);

    // Generate prediction
    const prediction = await predictNextMonthExpenses({
      recentExpenses: financialData.recentTransactions.lastMonthExpenses,
      categoryAnalysis: financialData.categoryAnalysis,
      monthlyBreakdown: financialData.monthlyBreakdown,
      summary: financialData.summary,
    });

    res.status(200).json({
      success: true,
      prediction,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error("Expense Prediction Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to predict expenses",
      error: error.message,
    });
  }
};

/**
 * Analyze spending patterns and get recommendations
 * @route POST /api/v1/ai/analyze-spending
 * @access Protected
 */
exports.analyzeSpending = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch transactions
    const expenses = await Expense.find({ userId }).sort({ date: -1 }).lean();
    const incomes = await Income.find({ userId }).sort({ date: -1 }).lean();

    if (expenses.length < 5) {
      return res.status(200).json({
        success: true,
        insufficientData: true,
        message: "Need at least 5 expense transactions for spending analysis",
      });
    }

    // Prepare data
    const financialData = prepareFinancialDataForAI(expenses, incomes);

    // Analyze spending
    const analysis = await analyzeSpendingPatterns({
      categoryAnalysis: financialData.categoryAnalysis,
      summary: financialData.summary,
      monthlyBreakdown: financialData.monthlyBreakdown,
      recentExpenses: financialData.recentTransactions.lastMonthExpenses,
    });

    res.status(200).json({
      success: true,
      analysis,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error("Spending Analysis Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze spending",
      error: error.message,
    });
  }
};

/**
 * Get financial health score
 * @route GET /api/v1/ai/health-score
 * @access Protected
 */
exports.getFinancialHealthScore = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all transactions
    const expenses = await Expense.find({ userId }).lean();
    const incomes = await Income.find({ userId }).lean();

    // Calculate basic metrics
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const balance = totalIncome - totalExpenses;

    // Simple scoring logic
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    let score = 50; // Base score

    // Adjust based on savings rate
    if (savingsRate > 30) score += 30;
    else if (savingsRate > 20) score += 20;
    else if (savingsRate > 10) score += 10;
    else if (savingsRate < 0) score -= 30;

    // Adjust based on transaction count (more data = better insights)
    if (expenses.length > 50) score += 10;
    else if (expenses.length > 20) score += 5;

    // Adjust based on balance
    if (balance > 0) score += 10;
    else score -= 20;

    score = Math.max(0, Math.min(100, score)); // Clamp between 0-100

    let rating = "poor";
    if (score >= 80) rating = "excellent";
    else if (score >= 60) rating = "good";
    else if (score >= 40) rating = "fair";

    res.status(200).json({
      success: true,
      healthScore: {
        score: Math.round(score),
        rating,
        savingsRate: savingsRate.toFixed(2),
        totalBalance: balance,
        totalIncome,
        totalExpenses,
        transactionCount: expenses.length + incomes.length,
      },
    });
  } catch (error) {
    console.error("Health Score Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate health score",
      error: error.message,
    });
  }
};
