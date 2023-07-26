"use strict";
const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.Login);
router.delete("/delete/:id", userController.deleteAccount);
router.get("/:userName", userController.findUser);

module.exports = router;
