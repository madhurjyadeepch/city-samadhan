const express = require("express");
const reportController = require("../controllers/reportControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

router.get("/", reportController.getAllReports);
router.patch("/changeProgress", reportController.changeProgress);

router.use(authController.protect);

router.get("/my-reports", reportController.myReports);

router.post(
  "/create",
  reportController.uploadReportFile,
  reportController.createReport
);

router.post("/getOne", reportController.getReportById);

module.exports = router;
