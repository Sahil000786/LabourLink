const express = require("express");
const {
  getMessagesForApplication,
  sendMessageToApplication,
  getMyChatConversations,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// List all conversations for logged-in user
router.get("/conversations", getMyChatConversations);

// Get messages for a specific application
router.get("/:applicationId", getMessagesForApplication);

// Send a message for an application
router.post("/:applicationId", sendMessageToApplication);

module.exports = router;
