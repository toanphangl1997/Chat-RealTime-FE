import { FaSearch } from "react-icons/fa";
import UserItem from "./UserItem";

const Sidebar = ({
  inboxUsers,
  selectedUser,
  setSelectedUser,
  searchTerm,
  setSearchTerm,
}) => {
  const filteredUsers = inboxUsers.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-1/4 bg-gray-900 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="mb-3 relative">
          <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((u) => (
          <UserItem
            key={u.id}
            user={u}
            isSelected={selectedUser?.id === u.id}
            onClick={() => setSelectedUser(u)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
