const express = require("express");
const Users = require("../models/users");
const Teams = require("../models/teams");
const app = require("../app");
var cors = require("cors");

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const teams = await Teams.find().populate("members");
      if (!teams.length) {
        return res.status(200).json({ message: "No teams yet!" });
      }
      return res.status(200).json({ data: teams });
    } catch (error) {}
  })
  .post(async (req, res) => {
    const { name, members } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ error: true, message: "Team Name required." });
    if (members.length < 2)
      return res
        .status(400)
        .json({ error: true, message: "Minimum no. of members = 2" });
    if (members.length > 11)
      return res
        .status(400)
        .json({ error: true, message: "Maximum members in the team = 11" });
    try {
      const team = await Teams.create(req.body);
      await team.populate("members");
      return res
        .status(201)
        .json({ message: team.name + " created!", data: team });
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
