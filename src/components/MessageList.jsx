import MessageItem from "./MessageItem";

const MessageList = ({ messages, selectedUser }) => (
  <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
    {selectedUser ? (
      messages.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          Start chatting with {selectedUser.name}!
        </p>
      ) : (
        messages.map((msg) => <MessageItem key={msg.id} msg={msg} />)
      )
    ) : (
      <p className="text-center text-gray-500 mt-10">Pick one to start with.</p>
    )}
  </div>
);

export default MessageList;
