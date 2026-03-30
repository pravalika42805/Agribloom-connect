import { useEffect, useState, useRef } from "react";
import "./Messages.css";
import { useParams, useNavigate } from "react-router-dom";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const scrollRef = useRef(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser._id;

  /* ===============================
     FETCH CONVERSATIONS
  ================================= */
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/conversations/${userId}`)
      .then(res => res.json())
      .then(data => setConversations(Array.isArray(data) ? data : []))
      .catch(() => setConversations([]));
  }, [userId]);

  /* ===============================
     AUTO OPEN FIRST CHAT
  ================================= */
  useEffect(() => {
    if (!id && conversations.length > 0) {
      navigate(`/messages/${conversations[0]._id}`);
    }
  }, [conversations, id, navigate]);

  /* ===============================
     FETCH MESSAGES + MARK READ
  ================================= */
  useEffect(() => {
    if (!id || !userId) return;

    const fetchMessages = () => {
      fetch(`http://localhost:5000/api/messages/${id}`)
        .then(res => res.json())
        .then(data => setMessages(Array.isArray(data) ? data : []))
        .catch(() => setMessages([]));
    };

    fetchMessages();

    fetch("http://localhost:5000/api/messages/mark-read", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: id, userId })
    });

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);

  }, [id, userId]);

  /* ===============================
     FETCH UNREAD COUNTS
  ================================= */
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/messages/unread/${userId}`)
      .then(res => res.json())
      .then(data => setUnreadCounts(data.byConversation || {}));

  }, [messages, userId]);

  /* ===============================
     AUTO SCROLL
  ================================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ===============================
     SEND TEXT MESSAGE
  ================================= */
  const sendMessage = async () => {
    if (!text.trim() || !id) return;

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: id,
          senderId: userId,
          text,
          type: "text"
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, data]);
        setText("");
      }

    } catch (err) {
      console.error("Send error:", err);
    }
  };

  /* ===============================
     UPDATE SWAP STATUS
  ================================= */
  const updateSwapStatus = async (swapId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/swaps/${swapId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        }
      );

      if (!res.ok) {
        throw new Error("Swap update failed");
      }

      // reload to reflect changes
      window.location.reload();

    } catch (err) {
      console.error("Swap update error:", err);
    }
  };

  /* ===============================
     GET OTHER USER
  ================================= */
  const getOtherUser = (conv) => {
    if (!conv?.members) return null;

    return conv.members.find(member =>
      typeof member === "object"
        ? member._id !== userId
        : member !== userId
    );
  };

  /* ===============================
     SORT CONVERSATIONS
  ================================= */
  const sortedConversations = [...conversations].sort((a, b) => {
    const aUnread = unreadCounts[a._id] || 0;
    const bUnread = unreadCounts[b._id] || 0;

    if (aUnread > 0 && bUnread === 0) return -1;
    if (aUnread === 0 && bUnread > 0) return 1;

    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return (
    <div className="messenger">

      {/* LEFT PANEL */}
      <div className="conversation-list">
        <h3>Chats</h3>

        {sortedConversations.map(conv => {
          const otherUser = getOtherUser(conv);

          return (
            <div
              key={conv._id}
              onClick={() => navigate(`/messages/${conv._id}`)}
              style={{
                padding: "12px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                background:
                  id === conv._id
                    ? "#e3f2fd"
                    : unreadCounts[conv._id]
                    ? "#f9fafb"
                    : "white"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: unreadCounts[conv._id] ? "600" : "500" }}>
                  {otherUser?.firstName || "User"}
                </div>

                {unreadCounts[conv._id] > 0 && (
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#22c55e",
                      borderRadius: "50%"
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT PANEL */}
      <div className="chat-section">
        {!id ? (
          <div className="empty-chat">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="chat-body">
              {messages.map(msg => {
                const isSender =
                  msg.sender?._id === userId ||
                  msg.sender === userId;

                if (msg.type === "swap") {
                  return (
                    <div
                      key={msg._id}
                      className={`message-row ${isSender ? "right" : "left"}`}
                    >
                      <div className="swap-proposal-card">

                        <div className="swap-header">
                          🔁 Crop Exchange Proposal
                        </div>

                        <div>
                          <strong>Offering:</strong>
                          <p>{msg.swapData?.offeredCropName}</p>
                          <p>{msg.swapData?.offeredQty} kg</p>
                          <p>₹ {msg.swapData?.offeredPrice}/kg</p>
                        </div>

                        <div>
                          <strong>Requesting:</strong>
                          <p>{msg.swapData?.requestedCropName}</p>
                        </div>

                        <div>
                          <strong>Status:</strong>
                          <p>{msg.swapData?.status}</p>
                        </div>

                        {!isSender && msg.swapData?.status === "pending" && (
                          <div style={{ marginTop: "10px" }}>
                            <button
                              onClick={() => updateSwapStatus(msg.swapId, "ACCEPTED")}
                              style={{ marginRight: "10px" }}
                            >
                              Accept
                            </button>

                            <button
                              onClick={() => updateSwapStatus(msg.swapId, "REJECTED")}
                            >
                              Reject
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg._id}
                    className={`message-row ${isSender ? "right" : "left"}`}
                  >
                    <div className={`bubble ${isSender ? "right" : "left"}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef}></div>
            </div>

            <div className="chat-input">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message"
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage()
                }
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Messages;