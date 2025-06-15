const MessageItem = ({ msg }) => (
  <div
    className={`mb-4 flex ${
      msg.sender === "Bạn" ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`max-w-md p-3 rounded-lg break-words whitespace-pre-line ${
        msg.sender === "Bạn"
          ? "bg-blue-600 text-white"
          : "bg-gray-700 text-gray-200"
      }`}
    >
      <p>{msg.content}</p>
      <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
    </div>
  </div>
);

export default MessageItem;
