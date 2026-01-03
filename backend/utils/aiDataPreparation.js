const moment = require("moment");

/**
 * Prepare and aggregate user financial data for AI analysis
 * @param {Array} expenses - User's expense transactions
 * @param {Array} incomes - User's income transactions
 * @returns {Object} Structured data ready for AI consumption
 */
exports.prepareFinancialDataForAI = (expenses, incomes) => {
  // Calculate date ranges
  const now = new Date();
  const sixMonthsAgo = moment().subtract(6, "months").toDate();
  const threeMonthsAgo = moment().subtract(3, "months").toDate();
  const oneMonthAgo = moment().subtract(1, "month").toDate();

  // Filter data by time periods
  const last6MonthsExpenses = expenses.filter(
    (e) => new Date(e.date) >= sixMonthsAgo,
  );
  const last3MonthsExpenses = expenses.filter(
    (e) => new Date(e.date) >= threeMonthsAgo,
  );
  const lastMonthExpenses = expenses.filter(
    (e) => new Date(e.date) >= oneMonthAgo,
  );

  const last6MonthsIncome = incomes.filter(
    (i) => new Date(i.date) >= sixMonthsAgo,
  );
  const last3MonthsIncome = incomes.filter(
    (i) => new Date(i.date) >= threeMonthsAgo,
  );

  // Calculate totals
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const last6MonthsIncomeTotal = last6MonthsIncome.reduce(
    (sum, inc) => sum + inc.amount,
    0,
  );
  const last6MonthsExpenseTotal = last6MonthsExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );
  const last3MonthsExpenseTotal = last3MonthsExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );
  const lastMonthExpenseTotal = lastMonthExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );

  // Calculate monthly averages
  const avgMonthlyIncome =
    last6MonthsIncome.length > 0 ? last6MonthsIncomeTotal / 6 : 0;
  const avgMonthlyExpense =
    last6MonthsExpenses.length > 0 ? last6MonthsExpenseTotal / 6 : 0;

  // Group expenses by category
  const expensesByCategory = {};
  last6MonthsExpenses.forEach((expense) => {
    const category = expense.category || "Uncategorized";
    if (!expensesByCategory[category]) {
      expensesByCategory[category] = {
        total: 0,
        count: 0,
        transactions: [],
      };
    }
    expensesByCategory[category].total += expense.amount;
    expensesByCategory[category].count += 1;
    expensesByCategory[category].transactions.push({
      amount: expense.amount,
      date: expense.date,
      icon: expense.icon,
    });
  });

  // Calculate category statistics
  const categoryAnalysis = Object.entries(expensesByCategory)
    .map(([category, data]) => ({
      category,
      totalSpent: data.total,
      averagePerTransaction: data.total / data.count,
      transactionCount: data.count,
      percentageOfTotal:
        last6MonthsExpenseTotal > 0
          ? ((data.total / last6MonthsExpenseTotal) * 100).toFixed(2)
          : 0,
      monthlyAverage: data.total / 6,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);

  // Group income by source
  const incomeBySource = {};
  last6MonthsIncome.forEach((income) => {
    const source = income.source || "Other";
    if (!incomeBySource[source]) {
      incomeBySource[source] = {
        total: 0,
        count: 0,
      };
    }
    incomeBySource[source].total += income.amount;
    incomeBySource[source].count += 1;
  });

  const sourceAnalysis = Object.entries(incomeBySource).map(
    ([source, data]) => ({
      source,
      total: data.total,
      monthlyAverage: data.total / 6,
      frequency: data.count,
    }),
  );

  // Calculate month-by-month breakdown for trend analysis
  const monthlyBreakdown = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = moment().subtract(i, "months").startOf("month").toDate();
    const monthEnd = moment().subtract(i, "months").endOf("month").toDate();

    const monthExpenses = expenses.filter((e) => {
      const expDate = new Date(e.date);
      return expDate >= monthStart && expDate <= monthEnd;
    });

    const monthIncome = incomes.filter((inc) => {
      const incDate = new Date(inc.date);
      return incDate >= monthStart && incDate <= monthEnd;
    });

    const monthExpenseTotal = monthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0,
    );
    const monthIncomeTotal = monthIncome.reduce(
      (sum, inc) => sum + inc.amount,
      0,
    );

    monthlyBreakdown.push({
      month: moment(monthStart).format("YYYY-MM"),
      monthName: moment(monthStart).format("MMMM YYYY"),
      income: monthIncomeTotal,
      expenses: monthExpenseTotal,
      balance: monthIncomeTotal - monthExpenseTotal,
      transactionCount: monthExpenses.length + monthIncome.length,
    });
  }

  // Calculate spending volatility (standard deviation)
  const monthlyExpenseAmounts = monthlyBreakdown.map((m) => m.expenses);
  const expenseVolatility = calculateStandardDeviation(monthlyExpenseAmounts);

  // Identify spending trends
  const recentTrend = calculateTrend(
    monthlyBreakdown.slice(-3).map((m) => m.expenses),
  );

  // Check data sufficiency
  const hasMinimumData =
    last3MonthsExpenses.length >= 10 && last3MonthsIncome.length >= 3;

  return {
    summary: {
      totalIncome,
      totalExpenses,
      totalBalance: totalIncome - totalExpenses,
      avgMonthlyIncome: Math.round(avgMonthlyIncome),
      avgMonthlyExpense: Math.round(avgMonthlyExpense),
      last3MonthsAvgExpense: Math.round(last3MonthsExpenseTotal / 3),
      lastMonthExpense: Math.round(lastMonthExpenseTotal),
      savingsRate:
        avgMonthlyIncome > 0
          ? (
              ((avgMonthlyIncome - avgMonthlyExpense) / avgMonthlyIncome) *
              100
            ).toFixed(2)
          : 0,
      expenseVolatility: Math.round(expenseVolatility),
      spendingTrend: recentTrend,
      dataQuality: {
        hasMinimumData,
        totalTransactions: expenses.length + incomes.length,
        expenseCount: expenses.length,
        incomeCount: incomes.length,
        dateRange: `${moment(sixMonthsAgo).format("MMM YYYY")} - ${moment(now).format("MMM YYYY")}`,
      },
    },
    categoryAnalysis,
    sourceAnalysis,
    monthlyBreakdown,
    recentTransactions: {
      lastMonthExpenses: lastMonthExpenses
        .map((e) => ({
          category: e.category,
          amount: e.amount,
          date: moment(e.date).format("YYYY-MM-DD"),
          icon: e.icon,
        }))
        .slice(0, 20),
      last3MonthsTopExpenses: last3MonthsExpenses
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10)
        .map((e) => ({
          category: e.category,
          amount: e.amount,
          date: moment(e.date).format("YYYY-MM-DD"),
        })),
    },
    patterns: {
      topCategories: categoryAnalysis.slice(0, 5).map((c) => c.category),
      categoryCount: Object.keys(expensesByCategory).length,
      incomeSourceCount: Object.keys(incomeBySource).length,
    },
  };
};

/**
 * Calculate standard deviation for volatility measurement
 */
function calculateStandardDeviation(values) {
  if (values.length === 0) return 0;

  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map((val) => Math.pow(val - avg, 2));
  const avgSquaredDiff =
    squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

  return Math.sqrt(avgSquaredDiff);
}

/**
 * Calculate trend direction (increasing, decreasing, stable)
 */
function calculateTrend(values) {
  if (values.length < 2) return "stable";

  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));

  const firstAvg =
    firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg =
    secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

  if (firstAvg === 0) {
    return secondAvg > 0 ? "increasing" : "stable";
  }

  const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (percentChange > 10) return "increasing";
  if (percentChange < -10) return "decreasing";
  return "stable";
}

/**
 * Check if user has sufficient data for AI analysis
 */
exports.hasMinimumDataForAnalysis = (expenses, incomes) => {
  const threeMonthsAgo = moment().subtract(3, "months").toDate();
  const recentExpenses = expenses.filter(
    (e) => new Date(e.date) >= threeMonthsAgo,
  );
  const recentIncome = incomes.filter(
    (i) => new Date(i.date) >= threeMonthsAgo,
  );

  return recentExpenses.length >= 10 && recentIncome.length >= 3;
};
