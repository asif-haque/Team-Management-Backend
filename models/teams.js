const moongoose = require("mongoose");

const teamSchema = new moongoose.Schema({
  members: {
    type: [
      {
        type: moongoose.Types.ObjectId,
        ref: "mock-users-coll",
      },
    ],
    default: [],
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Teams = new moongoose.model("teams", teamSchema);
module.exports = Teams;
