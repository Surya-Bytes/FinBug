const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate comprehensive financial analysis and predictions
 * @param {Object} financialData - Aggregated user financial data
 * @returns {Object} AI-generated predictions and insights
 */
exports.generateFinancialAnalysis = async (financialData) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `You are an expert financial advisor AI. Analyze this user's financial data and provide comprehensive insights.

USER FINANCIAL DATA:
${JSON.stringify(financialData, null, 2)}

Analyze the data and provide a detailed response in VALID JSON format (no markdown, just pure JSON):
{
  "nextMonthExpensePrediction": {
    "total": <number>,
    "confidence": <number 0-100>,
    "trend": "increasing|decreasing|stable"
  },
  "categoryPredictions": [
    {
      "category": "<string>",
      "predictedAmount": <number>,
      "currentAverage": <number>,
      "trend": "increasing|decreasing|stable",
      "confidence": <number 0-100>
    }
  ],
  "spendingAnalysis": {
    "overSpendingCategories": [
      {
        "category": "string",
        "currentSpending": 0,
        "recommendedBudget": 0,
        "savingsPotential": 0,
        "severity": "high|medium|low"
      }
    ],
    "efficientCategories": ["category names where spending is controlled"]
  },
  "recommendations": [
    {
      "type": "reduce|maintain|optimize",
      "category": "<string>",
      "message": "<actionable advice>",
      "priority": "high|medium|low",
      "potentialSavings": <number>
    }
  ],
  "financialHealthScore": {
    "score": <number 0-100>,
    "rating": "excellent|good|fair|poor",
    "breakdown": {
      "savingsRate": <number 0-100>,
      "expenseControl": <number 0-100>,
      "incomeStability": <number 0-100>
    }
  },
  "insights": [
    "<actionable insight string>"
  ],
  "warningFlags": [
    "<warning message if any concerning patterns detected>"
  ]
}

IMPORTANT RULES:
1. Be specific with numbers - calculate based on the actual data provided
2. Identify categories where user is spending more than 20% above average
3. Provide realistic, achievable recommendations
4. Consider income-to-expense ratio in your analysis
5. Flag any unusual spending patterns or spikes
6. Suggest specific percentage reductions for overspending categories
7. Return ONLY valid JSON - no markdown formatting, no code blocks
8. All amounts should be in the same currency as the input data`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from the response
    let jsonData;

    // Remove markdown code blocks if present
    let cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Try to find JSON object
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonData = JSON.parse(jsonMatch[0]);
    } else {
      jsonData = JSON.parse(cleanedText);
    }

    return {
      success: true,
      data: jsonData,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`AI Analysis failed: ${error.message}`);
  }
};

/**
 * Generate quick expense prediction for next month
 * @param {Object} expenseData - Historical expense data
 * @returns {Object} Expense prediction
 */
exports.predictNextMonthExpenses = async (expenseData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze this expense history and predict next month's total expenses.

EXPENSE DATA:
${JSON.stringify(expenseData, null, 2)}

Provide prediction in VALID JSON format (no markdown):
{
  "predictedTotal": <number>,
  "confidence": <number 0-100>,
  "reasoning": "<brief explanation>",
  "categoryBreakdown": [
    {"category": "<string>", "amount": <number>}
  ]
}

Return ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Expense Prediction Error:", error);
    throw new Error(`Expense prediction failed: ${error.message}`);
  }
};

/**
 * Analyze spending patterns and identify areas of concern
 * @param {Object} spendingData - Categorized spending data
 * @returns {Object} Spending analysis
 */
exports.analyzeSpendingPatterns = async (spendingData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a financial advisor. Analyze this spending pattern and identify where the user should control their expenses.

SPENDING DATA:
${JSON.stringify(spendingData, null, 2)}

Provide analysis in VALID JSON format (no markdown):
{
  "criticalCategories": [
    {
      "category": "<string>",
      "issue": "<description of the problem>",
      "recommendation": "<specific action to take>",
      "targetReduction": <percentage or amount>
    }
  ],
  "healthyCategories": ["<categories with good spending control>"],
  "overallAssessment": "<brief summary>",
  "actionPlan": [
    "<prioritized action items>"
  ]
}

Return ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Spending Analysis Error:", error);
    throw new Error(`Spending analysis failed: ${error.message}`);
  }
};
