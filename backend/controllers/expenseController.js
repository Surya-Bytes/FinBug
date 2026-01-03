const xlsx = require('xlsx');
const Expense = require('../models/Expense');
const fs = require('fs');
const csv = require('csv-parser');

// Add Expense Source
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;
    if (!category || !amount || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date)
    });

    await newExpense.save();
    res.status(200).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get Expense Source
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Expense Source
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Download Expense Source
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId: userId }).sort({ date: -1 });

    if (expense.length === 0) {
      return res.status(404).json({ message: "No expense data found" });
    }

    const data = expense.map(item => ({
      Category: item.category,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString(),
      Icon: item.icon || ''
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const filePath = `expense_details_${Date.now()}.xlsx`;
    xlsx.writeFile(wb, filePath);

    res.download(filePath, 'expense_details.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
      }
      // Delete file after download
      fs.unlinkSync(filePath);
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Bulk Upload Expenses from CSV
exports.bulkUploadExpenses = async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a CSV file' });
  }

  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  try {
    // Read and parse CSV file with UTF-8 encoding
    fs.createReadStream(req.file.path, { encoding: 'utf8' })
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim(),
        mapValues: ({ value }) => value.trim()
      }))
      .on('data', (row) => {
        // Expected CSV format: category, amount, date, icon (optional)
        const icon = row.icon || row.Icon;
        results.push({
          category: row.category || row.Category,
          amount: parseFloat(row.amount || row.Amount),
          date: row.date || row.Date,
          icon: icon && icon !== '' ? icon : '💰'
        });
      })
      .on('end', async () => {
        // Process each row
        for (let i = 0; i < results.length; i++) {
          const row = results[i];

          try {
            // Validate required fields
            if (!row.category || !row.amount || !row.date) {
              errors.push({ row: i + 1, error: 'Missing required fields', data: row });
              errorCount++;
              continue;
            }

            // Create expense
            const newExpense = new Expense({
              userId,
              icon: row.icon,
              category: row.category,
              amount: row.amount,
              date: new Date(row.date)
            });

            await newExpense.save();
            successCount++;
          } catch (error) {
            errors.push({ row: i + 1, error: error.message, data: row });
            errorCount++;
          }
        }

        // Delete uploaded file after processing
        fs.unlinkSync(req.file.path);

        // Send response
        res.status(200).json({
          message: 'CSV upload completed',
          summary: {
            total: results.length,
            success: successCount,
            failed: errorCount
          },
          errors: errors.length > 0 ? errors : undefined
        });
      })
      .on('error', (error) => {
        // Delete uploaded file on error
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error processing CSV file', error: error.message });
      });

  } catch (error) {
    // Delete uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
