const catchAsync = require("../utils/catchAsync");
const Report = require("../models/reportModel");
const AppError = require("../utils/appError");
const multer = require("multer");
const path = require("path");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 'uploads/' is the folder where files will be saved
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid overwriting files
    // Example: 1731100484123-my-cool-image.png
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create the Multer instance
const upload = multer({ storage: storage });

exports.uploadReportFile = upload.single("image");

exports.changeProgress = catchAsync(async (req, res, next) => {
  const { reportId, progress } = req.body;
  if (!reportId || !progress) {
    return next(new AppError("Please provide reportId and progress", 400));
  }

  const validProgress = ["pending", "in-progress", "completed"];
  if (!validProgress.includes(progress)) {
    return next(new AppError("Invalid progress status", 400));
  }

  const report = await Report.findById(reportId);
  report.status = progress;
  await report.save();
  res.status(200).json({
    status: "success",
    data: {
      report,
    },
  });
});

exports.getAllReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find();
  res.status(200).json({
    status: "success",
    results: reports.length,
    data: {
      reports,
    },
  });
});

exports.getReportById = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    return next(new AppError("No report found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      report,
    },
  });
});

exports.createReport = catchAsync(async (req, res, next) => {
  // 1. Check if a file was uploaded by Multer
  if (!req.file) {
    return next(new AppError("Please upload an image for the report.", 400));
  }

  // 2. Combine the text data from req.body with the file path from req.file
  const reportData = {
    ...req.body, // Copies title, description, author, etc.
    image: req.file.path, // Adds the image path from Multer
  };

  // 3. Create the report with the complete data object
  const newReport = await Report.create(reportData);

  // 4. Send the response
  res.status(201).json({
    status: "success",
    data: {
      report: newReport,
    },
  });
});

exports.deleteReport = catchAsync(async (req, res, next) => {
  const report = await Report.findByIdAndDelete(req.params.id);
  if (!report) {
    return next(new AppError("No report found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateReport = catchAsync(async (req, res, next) => {
  const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!report) {
    return next(new AppError("No report found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      report,
    },
  });
});
