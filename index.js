require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const commonConstants = require("./common/constants");
const app = express();

const sequelize = require("./database/db");
const User = require("./models/user");
const Expense = require("./models/expense");
const Category = require("./models/category");

// IMPLEMENT ROUTES
const expressTrackerRoutes = require("./routes/expenseTrackerRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes");

app.use(express.json());

// Authenticate the database connection and sync all the models
sequelize
  .sync()
  .then(() => {
    console.log(commonConstants.DATABASE_CONNECTION.SUCCESS);
  })
  .catch((error) => {
    console.error(commonConstants.DATABASE_CONNECTION.ERROR + error);
  });

const BASEROUTE = "/api/v1";

// IMPLEMENT THE BUSINESS LOGIC
app.use(BASEROUTE, expressTrackerRoutes);
app.use(BASEROUTE, authRoutes);
app.use(BASEROUTE, userRoutes);
app.use(BASEROUTE, categoryRoutes);

app.listen(process.env.PORT, () => {
  console.log(commonConstants.SERVER.CONNECTION_SUCCESS, process.env.PORT);
});
