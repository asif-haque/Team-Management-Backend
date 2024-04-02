const mongoose = require("mongoose");
const dbConnection = (url) => {
  mongoose
    .connect(url)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.log("Error connecting mongodb : ", err));
};

module.exports = dbConnection;
