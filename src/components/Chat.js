import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Chat() {
  const [user] = useAuthState(auth);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  console.log(selectedUser);

  useEffect(() => {
    const usersRef = database.ref("users");
    usersRef.on("value", (snapshot) => {
      const users = [];
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.online && userData.email !== user.email) {
          users.push({ ...userData, uid: childSnapshot.key });
        }
      });
      setActiveUsers(users);
    });

    return () => usersRef.off();
  }, [user]);

  useEffect(() => {
    if (user) {
      database.ref(`users/${user.uid}`).set({
        email: user.email,
        online: true,
      });

      return () => {
        database.ref(`users/${user.uid}/online`).set(false);
      };
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const userChatsRef = database.ref("chats");
      userChatsRef.on("value", (snapshot) => {
        const chats = snapshot.val();
        if (chats) {
          let allMessages = [];
          Object.keys(chats).forEach((chatId) => {
            const [uid1, uid2] = chatId.split("-");
            if (uid1 === user.uid || uid2 === user.uid) {
              const otherUserId = uid1 === user.uid ? uid2 : uid1;
              const chatMessages = Object.entries(chats[chatId]).map(
                ([key, value]) => ({
                  ...value,
                  key,
                  otherUserId,
                })
              );
              allMessages = [...allMessages, ...chatMessages];

              // Update status for received messages
              chatMessages.forEach((message) => {
                if (message.sender !== user.uid) {
                  if (message.status === "sent") {
                    updateMessageStatus(message, "delivered");
                  }
                  if (
                    message.status === "delivered" &&
                    selectedUser &&
                    selectedUser.uid === otherUserId
                  ) {
                    updateMessageStatus(message, "read");
                  }
                }
              });
            }
          });
          allMessages.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(allMessages);
        }
      });

      return () => userChatsRef.off();
    }
  }, [user, selectedUser]);

  const getChatId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}-${uid2}` : `${uid2}-${uid1}`;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      const chatId = getChatId(user.uid, selectedUser.uid);
      const newMessageRef = database.ref(`chats/${chatId}`).push();
      const messageData = {
        sender: user.uid,
        text: newMessage.trim(),
        timestamp: Date.now(),
        status: "sent",
      };
      newMessageRef.set(messageData).then(() => {
        // Update the status to 'delivered' immediately after sending
        updateMessageStatus(
          { ...messageData, key: newMessageRef.key },
          "delivered"
        );
      });
      setNewMessage("");
    }
  };

  const updateMessageStatus = (message, newStatus) => {
    const chatId = getChatId(message.sender, user.uid);
    database.ref(`chats/${chatId}/${message.key}/status`).set(newStatus);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return "✓✓✓";
      default:
        return "";
    }
  };

  const filteredMessages = selectedUser
    ? messages.filter((msg) => msg.otherUserId === selectedUser.uid)
    : [];

  return (
    <div className="chat">
      <div className="user-list">
        <div>
          <h3>Active Users</h3>
          <ul
            style={{
              listStyleType: "none",
              padding: 0,
            }}
          >
            {activeUsers.map((activeUser) => (
              <li
                key={activeUser.uid}
                onClick={() => setSelectedUser(activeUser)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  backgroundColor:
                    selectedUser && selectedUser.uid === activeUser.uid
                      ? "#f0f0f0"
                      : "white",
                }}
              >
                {activeUser.email}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div>{user.email}</div>
          <button
            onClick={() => {
              auth.signOut();
            }}
            style={{
              width: "100%",
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="chat-window">
        <div style={{ paddingLeft: "15px" }}>
          <h3>{selectedUser ? selectedUser.email : "Select a user"}</h3>
        </div>
        {selectedUser && (
          <>
            <div className="messages">
              {filteredMessages.map((message) => (
                <div
                  key={message.key}
                  className={`message ${
                    message.sender === user.uid ? "sent" : "received"
                  }`}
                >
                  <div>{message.text}</div>

                  {/* message time  */}
                  <div
                    style={{
                      fontSize: "0.7rem",
                      textAlign: "right",
                      marginRight: "10px",
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>

                  {message.sender === user.uid && (
                    <div className="status">
                      {getStatusIcon(message.status)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
