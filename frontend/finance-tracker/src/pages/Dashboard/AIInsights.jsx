import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { addThousandsSeparator } from "../../utils/helper";
import {
  LuBrain,
  LuRefreshCw,
  LuTrendingUp,
  LuTrendingDown,
  LuX,
} from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const AIInsights = ({ onRefresh }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insufficientData, setInsufficientData] = useState(false);

  const fetchAIAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(API_PATHS.AI.ANALYZE);

      if (response.data.insufficientData) {
        setInsufficientData(true);
        setAnalysis(null);
      } else {
        setInsufficientData(false);
        setAnalysis(response.data.analysis);
      }
    } catch (err) {
      console.error("Failed to fetch AI analysis:", err);
      setError(
        err.response?.data?.message ||
          "Failed to generate AI insights. Please try again.",
      );
      toast.error("Failed to load AI insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, []);

  const handleRefresh = () => {
    fetchAIAnalysis();
    if (onRefresh) onRefresh();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <LuBrain className="text-white text-2xl" />
            </div>
            <h5 className="text-lg font-bold text-gray-800">
              AI Financial Insights
            </h5>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">
              Analyzing your financial data...
            </p>
            <p className="text-sm text-gray-400 mt-2">
              This may take a few seconds
            </p>
          </div>
        </div>
      );
    }

    if (insufficientData) {
      return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <LuBrain className="text-white text-2xl" />
            </div>
            <h5 className="text-lg font-bold text-gray-800">
              AI Financial Insights
            </h5>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuBrain className="text-purple-600 text-3xl" />
            </div>
            <h6 className="text-lg font-semibold text-gray-700 mb-2">
              Not Enough Data Yet
            </h6>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Keep tracking your expenses and income! AI insights will be
              available once you have at least 10 expense transactions and 3
              income entries from the last 3 months.
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 mx-auto"
            >
              <LuRefreshCw className="text-lg" />
              Check Again
            </button>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <LuBrain className="text-white text-2xl" />
            </div>
            <h5 className="text-lg font-bold text-gray-800">
              AI Financial Insights
            </h5>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuX className="text-red-600 text-3xl" />
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 mx-auto"
            >
              <LuRefreshCw className="text-lg" />
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (!analysis) return null;

    const {
      nextMonthExpensePrediction,
      spendingAnalysis,
      recommendations,
      financialHealthScore,
      insights,
      warningFlags,
    } = analysis;

    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <LuBrain className="text-white text-2xl" />
            </div>
            <div>
              <h5 className="text-2xl font-extrabold text-gray-900">
                AI Financial Insights
              </h5>
              <p className="text-sm text-gray-500 font-medium">
                Powered by Gemini AI
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            title="Refresh predictions"
          >
            <LuRefreshCw
              className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Financial Health Score */}
        {financialHealthScore && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-base text-purple-700 font-bold mb-1">
                  Financial Health Score
                </p>
                <p className="text-5xl font-extrabold text-purple-900">
                  {financialHealthScore.score}/100
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-base font-bold ${
                    financialHealthScore.rating === "excellent"
                      ? "bg-green-100 text-green-800"
                      : financialHealthScore.rating === "good"
                        ? "bg-blue-100 text-blue-800"
                        : financialHealthScore.rating === "fair"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {financialHealthScore.rating.toUpperCase()}
                </span>
              </div>
            </div>
            {financialHealthScore.breakdown && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-sm text-purple-700 font-bold mb-1">
                    Savings
                  </p>
                  <p className="text-xl font-extrabold text-purple-900">
                    {financialHealthScore.breakdown.savingsRate}
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-sm text-purple-700 font-bold mb-1">
                    Control
                  </p>
                  <p className="text-xl font-extrabold text-purple-900">
                    {financialHealthScore.breakdown.expenseControl}
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-sm text-purple-700 font-bold mb-1">
                    Income
                  </p>
                  <p className="text-xl font-extrabold text-purple-900">
                    {financialHealthScore.breakdown.incomeStability}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next Month Prediction */}
        {nextMonthExpensePrediction && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-base text-gray-700 font-bold mb-1">
                  Next Month Predicted Expenses
                </p>
                <p className="text-3xl font-extrabold text-gray-900">
                  ₹
                  {addThousandsSeparator(
                    Math.round(nextMonthExpensePrediction.total),
                  )}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  {nextMonthExpensePrediction.trend === "increasing" ? (
                    <LuTrendingUp className="text-red-500 text-2xl" />
                  ) : nextMonthExpensePrediction.trend === "decreasing" ? (
                    <LuTrendingDown className="text-green-500 text-2xl" />
                  ) : null}
                  <span
                    className={`text-base font-bold ${
                      nextMonthExpensePrediction.trend === "increasing"
                        ? "text-red-600"
                        : nextMonthExpensePrediction.trend === "decreasing"
                          ? "text-green-600"
                          : "text-gray-600"
                    }`}
                  >
                    {nextMonthExpensePrediction.trend}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-semibold">
                  Confidence: {nextMonthExpensePrediction.confidence}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warning Flags */}
        {warningFlags && warningFlags.length > 0 && (
          <div className="mb-6">
            <h6 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-red-500 text-2xl">⚠️</span>
              Alerts & Warnings
            </h6>
            <div className="space-y-2">
              {warningFlags.map((warning, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <span className="text-red-500 font-bold text-2xl">⚠️</span>
                  <p className="text-base text-red-800 font-medium">
                    {warning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overspending Categories */}
        {spendingAnalysis?.overSpendingCategories &&
          spendingAnalysis.overSpendingCategories.length > 0 && (
            <div className="mb-6">
              <h6 className="text-lg font-bold text-gray-800 mb-3">
                Categories to Control
              </h6>
              <div className="space-y-3">
                {spendingAnalysis.overSpendingCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      cat.severity === "high"
                        ? "bg-red-50 border-red-500"
                        : cat.severity === "medium"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-orange-50 border-orange-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-base font-bold text-gray-900">
                        {cat.category}
                      </p>
                      <span
                        className={`text-sm px-2 py-1 rounded-full font-bold ${
                          cat.severity === "high"
                            ? "bg-red-200 text-red-800"
                            : cat.severity === "medium"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-orange-200 text-orange-800"
                        }`}
                      >
                        {cat.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Current Spending
                        </p>
                        <p className="text-lg font-extrabold text-gray-900">
                          ₹
                          {addThousandsSeparator(
                            Math.round(cat.currentSpending),
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Recommended
                        </p>
                        <p className="text-lg font-extrabold text-green-700">
                          ₹
                          {addThousandsSeparator(
                            Math.round(cat.recommendedBudget),
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/70 rounded px-3 py-2">
                      <p className="text-sm text-gray-700 font-medium">
                        💡 Potential Savings:{" "}
                        <span className="text-base font-extrabold text-green-700">
                          ₹
                          {addThousandsSeparator(
                            Math.round(cat.savingsPotential),
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Efficient Categories */}
        {spendingAnalysis?.efficientCategories &&
          spendingAnalysis.efficientCategories.length > 0 && (
            <div className="mb-6">
              <h6 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-green-500 text-2xl">✓</span>
                Well-Managed Categories
              </h6>
              <div className="flex flex-wrap gap-2">
                {spendingAnalysis.efficientCategories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-base font-bold border border-green-200"
                  >
                    ✓ {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="mb-6">
            <h6 className="text-lg font-bold text-gray-800 mb-3">
              AI Recommendations
            </h6>
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((rec, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 items-start p-4 rounded-lg ${
                    rec.priority === "high"
                      ? "bg-purple-50 border-2 border-purple-300"
                      : rec.priority === "medium"
                        ? "bg-blue-50 border-2 border-blue-300"
                        : "bg-gray-50 border-2 border-gray-300"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {rec.type === "reduce" && (
                      <span className="text-red-500 font-bold text-xl">🔻</span>
                    )}
                    {rec.type === "maintain" && (
                      <span className="text-green-500 font-bold text-xl">
                        ✅
                      </span>
                    )}
                    {rec.type === "optimize" && (
                      <span className="text-blue-500 font-bold text-xl">
                        💡
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {rec.category && (
                        <span className="text-sm font-bold text-gray-700">
                          {rec.category}
                        </span>
                      )}
                      {rec.priority === "high" && (
                        <span className="text-xs px-3 py-1 bg-purple-200 text-purple-900 rounded-full font-bold">
                          HIGH PRIORITY
                        </span>
                      )}
                    </div>
                    <p className="text-base text-gray-800 font-medium">
                      {rec.message}
                    </p>
                    {rec.potentialSavings > 0 && (
                      <p className="text-sm text-green-600 font-bold mt-1">
                        Save up to ₹
                        {addThousandsSeparator(
                          Math.round(rec.potentialSavings),
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General Insights */}
        {insights && insights.length > 0 && (
          <div>
            <h6 className="text-lg font-bold text-gray-800 mb-3">
              Key Insights
            </h6>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200"
                >
                  <span className="text-purple-600 font-bold text-xl">•</span>
                  <p className="text-base text-gray-800 font-medium">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout activeMenu="AI Insights">
      <div className="transition-page">{renderContent()}</div>
    </DashboardLayout>
  );
};

export default AIInsights;
