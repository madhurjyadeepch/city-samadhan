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
  // NEW: Added a category field
  category: {
    type: String,
    required: [true, "A report must have a category"],
  },
  // NEW: Added an address field
  address: {
    type: String,
    required: [true, "A report must have an address"],
  },

  image: {
    type: String,
    required: [true, "A report must have an image"],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending",
  },

  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
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
