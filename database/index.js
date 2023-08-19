const mongoose = require("mongoose");
const { mongoURL } = require("../config");

// connect to mongodb
mongoose
  .connect(mongoURL)
  .then(() => console.log("Database Connected Successfuly"))
  .catch((error) => console.log("koneksi gagal", error.message));
