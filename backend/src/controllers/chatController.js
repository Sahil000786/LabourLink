const Application = require("../models/Application");
const ChatMessage = require("../models/ChatMessage");

/**
 * Make sure the logged-in user belongs to this application
 * Returns the application document if allowed.
 */
async function ensureUserInApplication(applicationId, user) {
  const application = await Application.findById(applicationId)
    .populate({
      path: "job",
      populate: { path: "postedBy", select: "name email phone" },
    })
    .populate("worker", "name email phone")
    .populate("recruiter", "name email phone");

  if (!application) {
    const err = new Error("Application not found");
    err.statusCode = 404;
    throw err;
  }

  const uid = user._id ? user._id.toString() : user.id.toString();

  const isWorker =
    application.worker && application.worker._id.toString() === uid;
  const isRecruiter =
    application.recruiter && application.recruiter._id.toString() === uid;

  if (!isWorker && !isRecruiter) {
    const err = new Error("You are not allowed to view this chat");
    err.statusCode = 403;
    throw err;
  }

  return application;
}

/**
 * GET /api/chat/:applicationId
 * Get all messages for an application
 */
async function getMessagesForApplication(req, res) {
  try {
    const { applicationId } = req.params;

    const application = await ensureUserInApplication(applicationId, req.user);

    const messages = await ChatMessage.find({ application: applicationId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({ application, messages });
  } catch (error) {
    console.error("Get chat messages error:", error);
    const status = error.statusCode || 500;
    const msg =
      error.statusCode && error.message
        ? error.message
        : error.message || "Server error while fetching messages";
    return res.status(status).json({ message: msg });
  }
}

/**
 * POST /api/chat/:applicationId
 * Body: { message }
 */
async function sendMessageToApplication(req, res) {
  try {
    const { applicationId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Ensure user is part of this application (throws if not)
    await ensureUserInApplication(applicationId, req.user);

    const chatMessage = await ChatMessage.create({
      application: applicationId,
      sender: req.user._id,
      message: message.trim(),
    });

    const populated = await chatMessage.populate("sender", "name role");

    return res.status(201).json({
      message: "Message sent",
      chatMessage: populated,
    });
  } catch (error) {
    console.error("Send chat message error:", error);
    const status = error.statusCode || 500;
    const msg =
      error.statusCode && error.message
        ? error.message
        : error.message || "Server error while sending message";
    return res.status(status).json({ message: msg });
  }
}

/**
 * GET /api/chat/conversations
 * List conversations (applications) for this user with last message.
 */
async function getMyChatConversations(req, res) {
  try {
    let applications;

    if (req.user.role === "worker") {
      applications = await Application.find({ worker: req.user._id })
        .populate("job")
        .populate("recruiter", "name");
    } else if (req.user.role === "recruiter") {
      applications = await Application.find({ recruiter: req.user._id })
        .populate("job")
        .populate("worker", "name");
    } else {
      applications = [];
    }

    const results = [];

    // NOTE: simple implementation, OK for now
    for (const app of applications) {
      const lastMessage = await ChatMessage.findOne({
        application: app._id,
      })
        .populate("sender", "name role")
        .sort({ createdAt: -1 });

      results.push({
        application: app,
        lastMessage,
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error("Get conversations error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching conversations" });
  }
}

module.exports = {
  getMessagesForApplication,
  sendMessageToApplication,
  getMyChatConversations,
};
