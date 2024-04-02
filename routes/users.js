const express = require("express");
const Users = require("../models/users");

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;
    const search = req.query.search || "";
    const domain = req.query.domain || "";
    const available = req.query.available;
    const gender = req.query.gender || "";
    try {
      const users = await Users.find({
        first_name: { $regex: "^" + search, $options: "i" }, // starting with the search value
        domain: { $regex: "\\b" + domain + "\\b", $options: "i" }, // matching exact value
        available: available ? available : { $in: [true, false] }, // matching exact value
        gender: { $regex: "\\b" + gender + "\\b", $options: "i" }, // matching exact value
      })
        .sort({ updatedAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

      const total = await Users.countDocuments({
        first_name: { $regex: "^" + search, $options: "i" }, // starting with the search value
        domain: { $regex: "\\b" + domain + "\\b", $options: "i" }, // matching exact value
        available: available ? available : { $in: [true, false] }, // matching exact value
        gender: { $regex: "\\b" + gender + "\\b", $options: "i" }, // matching exact value
      });

      const totalPages = Math.ceil(total / perPage);

      return res.status(200).json({ totalPages, data: users });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error " + err });
    }
  })
  .post(async (req, res) => {
    const {
      first_name,
      last_name,
      email,
      gender,
      avatar,
      domain,
      available,
      id,
    } = req.body;
    if (!first_name || !email || !gender || !domain || !available) {
      return res
        .status(400)
        .json({ error: true, message: "Required fields missing." });
    }
    try {
      const newUser = await Users.create(req.body);
      return res.status(201).json({ message: "User created!", data: newUser });
    } catch (err) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error while creating user : " + err,
      });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const id = req.params.id;
    try {
      const user = await Users.findById(id);
      if (!user)
        res.status(400).json({ error: true, message: "User doesn't exist!" });
      return res.status(200).json({ data: user });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error " + err });
    }
  })
  .put(async (req, res) => {
    const id = req.params.id;
    try {
      const user = await Users.findByIdAndUpdate(id, req.body);
      if (!user)
        res.status(400).json({ error: true, message: "User doesn't exist!" });
      return res.json({ message: "User updated!", data: user });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error " + err });
    }
  })
  .delete(async (req, res) => {
    const id = req.params.id;
    try {
      const user = await Users.findByIdAndDelete(id);
      if (!user)
        res.status(400).json({ error: true, message: "User doesn't exist!" });
      return res.json({
        message: "User deleted : " + user.first_name + user.last_name,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error " + err });
    }
  });

module.exports = router;
