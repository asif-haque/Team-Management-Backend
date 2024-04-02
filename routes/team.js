const express = require("express");
const Users = require("../models/users");
const Teams = require("../models/teams");
const app = require("../app");
var cors = require("cors");

const router = express.Router();

router.route("/").post(async (req, res) => {
  const { name, members } = req.body;
  if (!name)
    return res
      .status(400)
      .json({ error: true, message: "Team Name required." });
  if (members.length < 2)
    return res
      .status(400)
      .json({ error: true, message: "Minimum no. of members = 2" });
  if (members.length > 20)
    return res
      .status(400)
      .json({ error: true, message: "Maximum members in the team = 11" });
  try {
    const team = await Teams.create(req.body);
    return res
      .status(201)
      .json({ message: team.name + " created!", data: team })
      .populate("members");
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error " + err });
  }
});

router.route("/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    const team = await Teams.findById(id).populate("members");
    if (!team) {
      return res
        .status(400)
        .json({ error: true, message: "Team doesn't exist!" });
    }
    return res.status(201).json({ data: team });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error " + err });
  }
});

module.exports = router;
