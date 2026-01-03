const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const scanBillImage = async (imageBuffer, imageType) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash"
        });

        const prompt = `Analyze this bill/receipt image and extract the following information in JSON format:
{
    "amount": <total amount as number, extract only the final total>,
    "category": <expense category like "Food & Dining", "Transportation", "Shopping", "Healthcare", "Entertainment", "Utilities", "Rent", "Groceries", etc.>,
    "date": <date in YYYY-MM-DD format, if not found use today's date>,
    "merchant": <merchant/vendor name>,
    "items": <brief description of items purchased>
}

Important:
- Extract only the TOTAL/FINAL amount, not subtotals
- Choose the most appropriate category from common expense categories
- If date is not clear, use today's date
- Keep merchant name concise
- Return ONLY valid JSON, no explanations`;

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: imageType
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        let jsonText = text.trim();
        
        // Remove markdown code blocks if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const extractedData = JSON.parse(jsonText);

        return {
            success: true,
            data: {
                amount: parseFloat(extractedData.amount) || 0,
                category: extractedData.category || 'Other',
                date: extractedData.date || new Date().toISOString().split('T')[0],
                merchant: extractedData.merchant || '',
                items: extractedData.items || ''
            }
        };
    } catch (error) {
        console.error('Error scanning bill:', error);
        return {
            success: false,
            error: error.message || 'Failed to scan bill image'
        };
    }
};

module.exports = { scanBillImage };
