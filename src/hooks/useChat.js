import { useEffect, useRef, useState } from "react";
import http from "../api/axios";

export const useChat = (user, socketRef, onNewMessage) => {
  const [messagesMap, setMessagesMap] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const loadedRef = useRef({});

  // ===== FETCH MESSAGES =====
  const fetchMessages = async (selectedUser) => {
    if (!selectedUser) return;

    try {
      const res = await http.get(
        `/messages/conversation/${selectedUser.id}`
      );

      const formatted = res.data.map((msg) => ({
        ...msg,
        isOwn: msg.sender.id === user.id,
      }));

      setMessagesMap((prev) => ({
        ...prev,
        [selectedUser.id]: formatted,
      }));

      loadedRef.current[selectedUser.id] = true;
    } catch (err) {
      console.log("Fetch messages error:", err);
    }
  };

  // ===== SEND MESSAGE =====
  const sendMessage = async (selectedUser, content) => {
    if (!selectedUser || !socketRef.current) return;

    const tempId = `temp-${Date.now()}`;

    const tempMsg = {
      id: tempId,
      sender: user,
      receiver: { id: selectedUser.id },
      content,
      isOwn: true,
      created_at: new Date().toISOString(),
      pending: true,
    };

    // optimistic UI
    setMessagesMap((prev) => {
      const prevMsgs = prev[selectedUser.id] || [];
      return {
        ...prev,
        [selectedUser.id]: [...prevMsgs, tempMsg],
      };
    });

    try {
      socketRef.current.emit("sendMessage", {
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content,
      });

      await http.post("/messages", {
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content,
      });
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  // ===== SOCKET =====
  useEffect(() => {
    if (!socketRef.current || !user) return;

    const socket = socketRef.current;

    const handleNewMessage = (msg) => {
      if (!msg.sender || !msg.receiver) return;

      const isOwn = msg.sender.id === user.id;

      const otherUserId = isOwn
        ? msg.receiver.id
        : msg.sender.id;

      setMessagesMap((prev) => {
        const prevMsgs = prev[otherUserId] || [];

        const exists = prevMsgs.find(
          (m) =>
            m.id === msg.id ||
            (m.pending &&
              m.content === msg.content &&
              m.sender.id === msg.sender.id)
        );

        if (exists) {
          return {
            ...prev,
            [otherUserId]: prevMsgs.map((m) =>
              m.pending &&
              m.content === msg.content &&
              m.sender.id === msg.sender.id
                ? { ...msg, isOwn }
                : m
            ),
          };
        }

        return {
          ...prev,
          [otherUserId]: [...prevMsgs, { ...msg, isOwn }],
        };
      });

      if (onNewMessage) onNewMessage(msg);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socketRef, user]);

  const getMessages = (selectedUser) => {
    if (!selectedUser) return [];
    return messagesMap[selectedUser.id] || [];
  };

  return {
    messagesMap,
    getMessages,
    fetchMessages,
    sendMessage,
    typingUsers,
  };
};