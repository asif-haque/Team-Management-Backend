require("dotenv").config();

const express = require("express");
const dbConnection = require("./dbConnection");
var cors = require("cors");
const userRouter = require("./routes/users");
const teamRouter = require("./routes/team");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
dbConnection(process.env.MONGO_URL);

// routes
app.use("/api/users", userRouter);
app.use("/api/team", teamRouter);
app.all("*", function (req, res) {
  // Return an error message
  res.status(404).json({ error: true, message: "Invalid path" });
});

// port
app.listen(process.env.PORT, () =>
  console.log("Server started at ", process.env.PORT)
);

module.exports = app;
