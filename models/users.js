const { Int32 } = require("mongodb");
const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    domain: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
    },
    id: {
      type: Number,
    },
    team: {
      type: mongoose.Types.ObjectId,
      ref: "teams",
    },
  },
  { timestamps: true }
);

const Users = new mongoose.model("mock-users-coll", usersSchema);

module.exports = Users;
