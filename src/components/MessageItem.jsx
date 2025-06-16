// MessageItem.jsx
const MessageItem = ({ msg }) => {
  const isOwn = msg.sender === "Bạn";

  return (
    <div className={`mb-2 flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          ${isOwn ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}
          rounded-lg
          px-3 py-2 sm:px-4 sm:py-3         /* padding nhỏ hơn trên mobile */
          max-w-[75%] sm:max-w-[60%]        /* giới hạn chiều ngang */
          text-sm sm:text-base              /* chữ nhỏ trên mobile */
          break-words whitespace-pre-line
        `}
      >
        <p>{msg.content}</p>
        <p className="text-[11px] sm:text-xs text-gray-300 mt-1 text-right">
          {msg.time}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
