import { useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import UserItem from "./UserItem";
import { useOnlineUsers } from "../context/OnlineUsersContext";
import { getAvatar } from "../utils/avatar";
import Avatar from "./Avatar";

const Sidebar = ({
  inboxUsers,
  allUsers,
  selectedUser,
  setSelectedUser,
  searchTerm,
  setSearchTerm,
  show,
  isMobile,
  user,
  unreadMap,
}) => {
  if (isMobile && !show) return null;

  const onlineUsers = useOnlineUsers();
  const scrollRef = useRef(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // FILTER
  const filteredUsers = inboxUsers.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // MERGE
  const mergedUsers = [
    ...inboxUsers,
    ...allUsers.filter((u) => !inboxUsers.some((i) => i.id === u.id)),
  ];

  const horizontalUsers = searchTerm
    ? filteredUsers
    : mergedUsers.filter((u) => u.id !== user.id);

  // SCROLL DRAG
  const handleMouseDown = (e) => {
    isDragging.current = true;
    scrollRef.current.classList.add("cursor-grabbing");
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // SCROLL WHEEL
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="bg-gray-900 border-r border-gray-700 flex flex-col w-full h-full">
      {/* SEARCH */}
      <div className="p-4 border-b border-gray-700">
        <div className="mb-3 relative">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white rounded-lg"
          />
        </div>

        {/* HORIZONTAL USERS */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 cursor-grab scrollbar-hide"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {horizontalUsers.map((u) => {
            const isOnline = onlineUsers.includes(u.id);
            const isUnread = unreadMap?.[u.id];

            return (
              <div
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className="flex flex-col items-center cursor-pointer min-w-[60px]"
              >
                <div className="relative">
                  {/* <img
                    src={getAvatar(u.avatar, u.name)}
                    className={`w-12 h-12 rounded-full border-2 transition ${
                      selectedUser?.id === u.id
                        ? "border-purple-500"
                        : isUnread
                          ? "border-yellow-400"
                          : "border-gray-700"
                    }`}
                  /> */}

                  <Avatar
                    user={u}
                    size="lg"
                    showOnline
                    isOnline={isOnline}
                    className={`border-2 ${
                      selectedUser?.id === u.id
                        ? "border-purple-500"
                        : isUnread
                          ? "border-yellow-400"
                          : "border-gray-700"
                    } rounded-full`}
                  />

                  {/* ONLINE DOT */}
                  {/* <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      isOnline ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></span> */}

                  {/* UNREAD DOT */}
                  {isUnread && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></span>
                  )}
                </div>

                <span className="text-xs text-gray-300 mt-1 truncate w-14 text-center">
                  {u.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((u) => (
          <UserItem
            key={u.id}
            user={u}
            isSelected={selectedUser?.id === u.id}
            onClick={() => setSelectedUser(u)}
            isOnline={onlineUsers.includes(u.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
