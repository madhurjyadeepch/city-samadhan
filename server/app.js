const express = require("express");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const reportRouter = require("./routes/reportRoutes");
const path = require("path");

const app = express();

app.use(express.json());
// This makes files in the 'uploads' folder accessible via URL
app.use("/uploads", express.static("uploads"));

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/reports", reportRouter);

// app.all("*", (req, res, next) => {
//   next(
//     new AppError(
//       `The requested URL ${req.originalUrl} was not found on this server.`,
//       404
//     )
//   );
// });

app.use(globalErrorHandler);
module.exports = app;
