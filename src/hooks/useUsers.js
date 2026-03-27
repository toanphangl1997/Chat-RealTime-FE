import { useEffect, useState } from "react";
import http from "../api/axios";

export const useUsers = (user, socketRef) => {
  const [inboxUsers, setInboxUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);


  // FETCH INIT
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [inboxRes, usersRes] = await Promise.all([
          http.get("/messages/inbox"),
          http.get("/users"),
        ]);

        setInboxUsers(inboxRes.data);
        setAllUsers(usersRes.data.filter((u) => u.id !== user.id));
      } catch (err) {
        console.log("Fetch users error:", err);
      }
    };

    fetchData();
  }, [user]);

  // REALTIME
  useEffect(() => {
    if (!socketRef?.current || !user) return;

    const socket = socketRef.current;

    const handleNewMessage = (msg) => {
      const otherUser =
        msg.sender.id === user.id ? msg.receiver : msg.sender;

      // UPDATE inboxUsers (KHÔNG MUTATE)
      setInboxUsers((prev) => {
        const exists = prev.find((u) => u.id === otherUser.id);

        if (exists) {
          return [
            {
              ...exists,
              ...otherUser,
              lastMessage: msg.content,
            },
            ...prev.filter((u) => u.id !== otherUser.id),
          ];
        }

        return [
          {
            ...otherUser,
            lastMessage: msg.content,
          },
          ...prev,
        ];
      });

      // đảm bảo user mới cũng có trong allUsers
      setAllUsers((prev) => {
        const exists = prev.find((u) => u.id === otherUser.id);
        if (exists) return prev;
        return [...prev, otherUser];
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => socket.off("new_message", handleNewMessage);
  }, [socketRef, user]);

  return { inboxUsers, allUsers };
};