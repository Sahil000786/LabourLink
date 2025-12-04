import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getMessagesForApplication,
  sendMessageToApplication,
} from "../api/chatApi";

const ChatPage = () => {
  const { applicationId } = useParams();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMessagesForApplication(applicationId);
      setApplication(data.application);
      setMessages(data.messages);
    } catch (err) {
      console.error("Load chat error:", err.response?.data || err.message);
      const backendMessage = err.response?.data?.message;
      setError(
        backendMessage ||
          err.message ||
          "Server error while fetching messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [applicationId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    setError("");

    try {
      await sendMessageToApplication(applicationId, input.trim());
      setInput("");
      await loadMessages();
    } catch (err) {
      console.error("Send message error:", err.response?.data || err.message);
      const backendMessage = err.response?.data?.message;
      setError(
        backendMessage ||
          err.message ||
          "Server error while sending message"
      );
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const otherPartyName =
    application && user
      ? application.worker &&
        application.worker._id === user.id
        ? application.recruiter?.name
        : application.worker?.name
      : "";

  const jobTitle = application?.job?.title || "";

  return (
    <div className="ll-card" style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="ll-card-header">
        <div>
          <div className="ll-card-title">Chat</div>
          <div className="ll-card-sub">
            {jobTitle && (
              <>
                Regarding job: <strong>{jobTitle}</strong>
              </>
            )}
            {otherPartyName && (
              <>
                {" "}
                • with <strong>{otherPartyName}</strong>
              </>
            )}
          </div>
        </div>
        <div style={{ fontSize: 13 }}>
          <Link
            to={
              user?.role === "worker"
                ? "/worker-dashboard"
                : "/recruiter-dashboard"
            }
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading chat...</p>
      ) : error ? (
        <p style={{ color: "#dc2626" }}>{error}</p>
      ) : (
        <>
          <div
            style={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              padding: 12,
              height: 360,
              overflowY: "auto",
              marginBottom: 12,
            }}
          >
            {messages.length === 0 && (
              <p style={{ fontSize: 13, color: "#6b7280" }}>
                No messages yet. Start the conversation.
              </p>
            )}

            {messages.map((m) => {
              const isMe = m.sender && m.sender._id === user.id;
              return (
                <div
                  key={m._id}
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      background: isMe ? "#2563eb" : "#ffffff",
                      color: isMe ? "#ffffff" : "#111827",
                      padding: "6px 10px",
                      borderRadius: 12,
                      border: isMe ? "none" : "1px solid #e5e7eb",
                      fontSize: 13,
                    }}
                  >
                    <div style={{ marginBottom: 2 }}>{m.message}</div>
                    <div
                      style={{
                        fontSize: 11,
                        opacity: 0.7,
                        textAlign: "right",
                      }}
                    >
                      {formatTime(m.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="ll-form">
            <div className="ll-field">
              <label className="ll-label">Message</label>
              <textarea
                className="ll-textarea"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
              />
            </div>

            {error && (
              <div style={{ color: "#dc2626", fontSize: 13 }}>{error}</div>
            )}

            <button
              type="submit"
              className="ll-btn ll-btn-primary"
              disabled={sending}
              style={{ alignSelf: "flex-end" }}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatPage;
