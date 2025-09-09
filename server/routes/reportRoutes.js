const express = require("express");
const reportController = require("../controllers/reportControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

// Public routes
router.get("/", reportController.getAllReports);
router.get("/:id", reportController.getReportById);

// Protected routes
// router.use(authController.protect);

router.post(
  "/create",
  reportController.uploadReportFile,
  reportController.createReport
);
router.patch("/changeProgress", reportController.changeProgress);

module.exports = router;
