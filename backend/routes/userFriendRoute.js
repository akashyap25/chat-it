"use strict";
const express = require("express");
const userFriendController = require("../controllers/userFriendController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/addFriend", userFriendController.addFriend);
router.get("/", userFriendController.getFriends);

module.exports = router;
