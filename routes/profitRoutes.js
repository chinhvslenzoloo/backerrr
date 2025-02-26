const express = require("express");
const router = express.Router();
const profitController = require("../controllers/profitController");

// GET /api/profit - Get full profit report
router.get("/", profitController.getProfitReport);

// GET /api/profit/date-range - Get profit report by date range
router.get("/date-range", profitController.getProfitByDateRange);

// GET /api/profit/:orderId - Get profit for a specific order
router.get("/:orderId", profitController.getProfitByOrder);

module.exports = router;
