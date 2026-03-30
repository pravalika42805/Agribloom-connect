import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MessagesList.css";

function MessagesList() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/conversations/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setConversations(data);
        }
      });
  }, [userId]);

  return (
    <div className="messages-wrapper">
      <h2>Your Chats</h2>

      {conversations.length === 0 ? (
        <p className="empty">No conversations yet</p>
      ) : (
        <div className="chat-list">
          {conversations.map(conv => {
            const otherUser = conv.members.find(
              m => m._id !== userId
            );

            return (
              <div
                key={conv._id}
                className="chat-card"
                onClick={() => navigate(`/messages/${conv._id}`)}
              >
                <div className="chat-avatar">
                  {otherUser?.firstName?.charAt(0)}
                </div>

                <div className="chat-info">
                  <h4>
                    {otherUser?.firstName} {otherUser?.lastName}
                  </h4>
                  <p>
                    {conv.cropId?.cropName} • ₹{conv.cropId?.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MessagesList;
