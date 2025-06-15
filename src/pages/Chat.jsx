// components/Chat.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import http from "../api/axios";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

const socket = io("http://localhost:3197");

const Chat = () => {
  const [user, setUser] = useState(null);
  const [inboxUsers, setInboxUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const socketRef = useRef(socket);

  useEffect(() => {
    const fetchUserAndInbox = async () => {
      try {
        const res = await http.get("/auth/me");
        setUser(res.data);
        socketRef.current.emit("userOnline", res.data.id);

        const inboxRes = await http.get("/messages/inbox");
        setInboxUsers(inboxRes.data);
      } catch (err) {
        console.error("Không lấy được user hoặc inbox:", err);
        navigate("/login");
      }
    };
    fetchUserAndInbox();
  }, [navigate]);

  useEffect(() => {
    socketRef.current.on("onlineUsers", (onlineList) => {
      setInboxUsers((prev) =>
        prev.map((u) => ({
          ...u,
          online: onlineList.some((ou) => ou.id === u.id),
        }))
      );
      setSelectedUser((prev) => {
        if (!prev) return null;
        const isOnline = onlineList.some((ou) => ou.id === prev.id);
        return { ...prev, online: isOnline };
      });
    });

    return () => {
      socketRef.current.off("onlineUsers");
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !user) return;
      try {
        const res = await http.get("/messages");
        const filtered = res.data
          .filter(
            (m) =>
              (m.sender.id === user.id && m.receiver.id === selectedUser.id) ||
              (m.receiver.id === user.id && m.sender.id === selectedUser.id)
          )
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const formatted = filtered.map((msg) => ({
          id: msg.id,
          sender: msg.sender.id === user.id ? "Bạn" : msg.sender.name,
          content: msg.content,
          time: new Date(msg.created_at).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Không lấy được tin nhắn:", err);
      }
    };
    fetchMessages();
  }, [selectedUser, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;

    try {
      await http.post("/messages", {
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content: messageInput,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "Bạn",
          content: messageInput,
          time: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setMessageInput("");
    } catch (err) {
      console.error("Gửi tin nhắn lỗi:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-purple-900 flex">
      <div className="h-full w-full bg-gray-800 rounded-none shadow-none flex overflow-hidden">
        <Sidebar
          inboxUsers={inboxUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleSendMessage={handleSendMessage}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default Chat;
