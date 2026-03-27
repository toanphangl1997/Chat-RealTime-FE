import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages = [], selectedUser }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-800 px-2 py-1 sm:px-3 sm:py-2 text-center text-gray-500">
        Pick one to start with.
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-800 px-2 py-1 sm:px-3 sm:py-2 text-center text-gray-400">
        Start chatting with {selectedUser.name}!
      </div>
    );
  }

  // sort theo thời gian
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-800 px-2 py-1 sm:px-3 sm:py-2">
      {sortedMessages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;