const express = require("express");
const reportController = require("../controllers/reportControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

// --- PUBLIC ROUTES ---
// This generic route is open to anyone.
router.get("/", reportController.getAllReports);

// --- AUTHENTICATION WALL ---
// All routes defined BELOW this line will require a valid token.
router.use(authController.protect);

// --- SPECIFIC PROTECTED ROUTES ---
// These static routes must come before any dynamic routes.
router.get("/my-reports", reportController.myReports);

router.post(
  "/create",
  reportController.uploadReportFile,
  reportController.createReport
);

router.patch("/changeProgress", reportController.changeProgress);

router.post("/getOne", reportController.getReportById);

module.exports = router;
