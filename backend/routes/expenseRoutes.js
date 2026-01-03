const express = require("express");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
  bulkUploadExpenses
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/csvUploadMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/downloadexcel", protect, downloadExpenseExcel);
router.post("/bulk-upload", protect, upload.single('file'), bulkUploadExpenses);
router.delete("/:id", protect, deleteExpense);

module.exports = router;
