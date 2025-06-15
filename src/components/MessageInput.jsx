const MessageInput = ({ messageInput, setMessageInput, handleSendMessage }) => (
  <form
    onSubmit={handleSendMessage}
    className="p-4 border-t border-gray-700 bg-gray-900"
  >
    <div className="flex items-center">
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Enter message..."
        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      >
        Send
      </button>
    </div>
  </form>
);

export default MessageInput;
