import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages = [], selectedUser }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-800">
        Pick one to start with.
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-800">
        Start chatting with {selectedUser.name}!
      </div>
    );
  }

  // SORT
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );

  // ===== TIME HELPERS =====
  const isDifferentDay = (prev, curr) => {
    const d1 = new Date(prev.created_at);
    const d2 = new Date(curr.created_at);

    return d1.toDateString() !== d2.toDateString();
  };

  const isTimeGapLarge = (prev, curr) => {
    const diff = new Date(curr.created_at) - new Date(prev.created_at);

    return diff > 30 * 60 * 1000; // 30 phút
  };

  const formatSeparatorTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Today ${date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    if (isYesterday) {
      return `Yesterday ${date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "numeric",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-800 px-3 py-2">
      {sortedMessages.map((msg, index) => {
        const prevMsg = sortedMessages[index - 1];
        const nextMsg = sortedMessages[index + 1];

        const showTimeSeparator =
          !prevMsg ||
          isDifferentDay(prevMsg, msg) ||
          isTimeGapLarge(prevMsg, msg);

        return (
          <div key={msg.id}>
            {/* TIME SEPARATOR */}
            {showTimeSeparator && (
              <div className="text-center my-4 text-xs text-gray-400">
                {formatSeparatorTime(msg.created_at)}
              </div>
            )}

            <MessageItem msg={msg} prevMsg={prevMsg} nextMsg={nextMsg} />
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
