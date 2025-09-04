const express = require("express");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
