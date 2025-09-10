const express = require("express");
const reportController = require("../controllers/reportControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

// Public routes
router.get("/", reportController.getAllReports);

// Protected routes
router.use(authController.protect);

router.get("/my-reports", reportController.myReports);
router.post(
  "/create",
  reportController.uploadReportFile,
  reportController.createReport
);
router.patch("/changeProgress", reportController.changeProgress);

router.get("/:id", reportController.getReportById);

module.exports = router;
