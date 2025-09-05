const catchAsync = require("../utils/catchAsync");
const Report = require("../models/reportModel");
const AppError = require("../utils/appError");

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
  const newReport = await Report.create(req.body);
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
