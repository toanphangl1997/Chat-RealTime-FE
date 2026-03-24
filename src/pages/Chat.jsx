import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/axios";
import { socket } from "../socket";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

const Chat = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [inboxUsers, setInboxUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const socketRef = useRef(null);
  const selectedUserIdRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

  // Responsive
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setShowSidebar(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Select user
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (isMobile) setShowSidebar(false);
  };

  // Fetch current user & connect socket
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login", { replace: true });

    const fetchUser = async () => {
      try {
        const res = await http.get("/auth/me");
        setUser(res.data);

        // CONNECT SOCKET
        socket.auth = { token }; // nếu server check token
        socket.connect();
        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });

        socket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
        });

        // Listen incoming messages
        socket.on("new_message", (msg) => {
          setMessages((prev) => [
            ...prev,
            {
              ...msg,
              isOwn: Number(msg.sender.id) === Number(res.data.id),
            },
          ]);
        });

      } catch (err) {
        navigate("/login", { replace: true });
      }
    };

    fetchUser();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetch inbox
  useEffect(() => {
    if (!user) return;

    const fetchInbox = async () => {
      try {
        const res = await http.get("/messages/inbox");
        setInboxUsers(res.data);

        if (res.data.length > 0) {
          setSelectedUser(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInbox();
  }, [user]);

  // Fetch conversation messages
  useEffect(() => {
    if (!selectedUser || !user) return;
    if (selectedUserIdRef.current === selectedUser.id) return;

    selectedUserIdRef.current = selectedUser.id;

    const fetchMessages = async () => {
      try {
        const res = await http.get(
          `/messages/conversation/${selectedUser.id}`
        );

        setMessages(
          res.data.map((msg) => ({
            ...msg,
            isOwn: Number(msg.sender.id) === Number(user.id),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedUser?.id, user]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;

    const tempMsg = {
      id: Date.now(),
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      receiver: { id: selectedUser.id },
      content: messageInput,
      isOwn: true,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setMessageInput("");

    try {
      await http.post("/messages", {
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content: tempMsg.content,
      });

      // Emit to socket
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("send_message", tempMsg);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await http.post("/auth/logout").catch(() => {});
    } catch (err) {}

    localStorage.removeItem("token");
    delete http.defaults.headers.common["Authorization"];

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setUser(null);
    setInboxUsers([]);
    setSelectedUser(null);
    setMessages([]);
    setMessageInput("");

    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex w-full overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "block w-full" : "hidden"
        } md:block md:w-1/4`}
      >
        <Sidebar
          inboxUsers={inboxUsers}
          selectedUser={selectedUser}
          setSelectedUser={handleSelectUser}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleLogout={handleLogout}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`${
          showSidebar ? "hidden" : "block w-full"
        } md:block md:w-3/4`}
      >
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleSendMessage={handleSendMessage}
          handleLogout={handleLogout}
          isMobile={isMobile}
          goBack={() => setShowSidebar(true)}
        />
      </div>
    </div>
  );
};

export default Chat;