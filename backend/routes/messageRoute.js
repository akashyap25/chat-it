"use strict";
const express = require("express");
const messageController = require("../controllers/messageController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/", messageController.addMessage);
router.get("/:senderId/:receiverId", messageController.getMessages);
router.get("/lastMessage/:senderId/:receiverId", messageController.getLastMessage);

module.exports = router;
