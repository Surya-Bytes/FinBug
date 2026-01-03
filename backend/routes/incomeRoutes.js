const express = require("express");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
  bulkUploadIncome
} = require("../controllers/incomeController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/csvUploadMiddleware");

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/downloadexcel", protect, downloadIncomeExcel);
router.post("/bulk-upload", protect, upload.single('file'), bulkUploadIncome);
router.delete("/:id", protect, deleteIncome);

module.exports = router;
