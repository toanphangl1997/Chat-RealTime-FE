import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, selectedUser }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-800 px-2 py-1 sm:px-3 sm:py-2">
      {selectedUser ? (
        messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            Start chatting with {selectedUser.name}!
          </p>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageItem key={msg.id} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </>
        )
      ) : (
        <p className="text-center text-gray-500 mt-10">
          Pick one to start with.
        </p>
      )}
    </div>
  );
};

export default MessageList;