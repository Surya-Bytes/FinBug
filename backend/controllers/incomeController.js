const xlsx = require('xlsx');
const Income = require('../models/Income');
const fs = require('fs');
const csv = require('csv-parser');

// Add Income Source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;
    if (!source || !amount || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date)
    });

    await newIncome.save();
    res.status(200).json({ message: 'Income added successfully', income: newIncome });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get Income Source
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Income Source
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Download Income Source
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId: userId }).sort({ date: -1 });

    if (income.length === 0) {
      return res.status(404).json({ message: "No income data found" });
    }

    const data = income.map(item => ({
      Source: item.source,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString(),
      Icon: item.icon || ''
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const filePath = `income_details_${Date.now()}.xlsx`;
    xlsx.writeFile(wb, filePath);

    res.download(filePath, 'income_details.xlsx', (err) => {
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

// Bulk Upload Income from CSV
exports.bulkUploadIncome = async (req, res) => {
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
        // Expected CSV format: source, amount, date, icon (optional)
        const icon = row.icon || row.Icon;
        results.push({
          source: row.source || row.Source,
          amount: parseFloat(row.amount || row.Amount),
          date: row.date || row.Date,
          icon: icon && icon !== '' ? icon : '💵'
        });
      })
      .on('end', async () => {
        // Process each row
        for (let i = 0; i < results.length; i++) {
          const row = results[i];

          try {
            // Validate required fields
            if (!row.source || !row.amount || !row.date) {
              errors.push({ row: i + 1, error: 'Missing required fields', data: row });
              errorCount++;
              continue;
            }

            // Create income
            const newIncome = new Income({
              userId,
              icon: row.icon,
              source: row.source,
              amount: row.amount,
              date: new Date(row.date)
            });

            await newIncome.save();
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
