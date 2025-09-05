const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "A report must have a title"],
  },
  description: {
    type: String,
    required: [true, "A report must have a description"],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
