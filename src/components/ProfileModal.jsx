import { useState, useEffect } from "react";
import http from "../api/axios";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User";

const ProfileModal = ({ isOpen, onClose, user, setUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(DEFAULT_AVATAR);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPreview(user.avatar || DEFAULT_AVATAR);

      setAvatarFile(null);
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  // ===================== AVATAR =====================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const updateAvatar = async () => {
    if (!avatarFile) return null;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const res = await http.patch(`/users/${user.id}/avatar`, formData);
    return res.data;
  };

  // ===================== NAME =====================
  const updateName = async () => {
    if (name === user.name) return null;

    await http.patch(`/users/${user.id}`, { name });

    return {
      ...user,
      name,
    };
  };

  // ===================== PASSWORD =====================
  const updatePassword = async () => {
    if (!currentPassword && !newPassword) return;

    if (!currentPassword || !newPassword) {
      throw new Error("Vui lòng nhập đủ password");
    }

    if (newPassword.length < 6) {
      throw new Error("Password phải >= 6 ký tự");
    }

    await http.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  };

  // ===================== SUBMIT =====================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      let updatedUser = { ...user };

      // 1. avatar
      const avatarRes = await updateAvatar();
      if (avatarRes) {
        updatedUser = avatarRes;
      }

      // 2. name
      const nameRes = await updateName();
      if (nameRes) {
        updatedUser = {
          ...updatedUser,
          name: nameRes.name,
        };
      }

      // 3. password
      await updatePassword();

      setUser(updatedUser);
      onClose();
    } catch (err) {
      console.log("Update profile error:", err);
      alert(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // ===================== VALIDATE =====================
  const isChanged =
    avatarFile || name !== user.name || (currentPassword && newPassword);

  // ===================== UI =====================
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800/90 p-6 rounded-2xl w-80 shadow-xl border border-gray-700">
        {/* Title */}
        <h2 className="text-yellow-300 text-xl mb-4 text-center font-semibold tracking-wide">
          {name || "User"}
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <label className="cursor-pointer group relative">
            <img
              src={preview}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-600 group-hover:opacity-80 transition"
            />
            <input type="file" hidden onChange={handleFileChange} />

            <div className="absolute inset-0 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition">
              Change
            </div>
          </label>
        </div>

        {/* Name */}
        <input
          className="w-full mb-2 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        {/* Email */}
        <input
          className="w-full mb-2 p-2 rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed"
          value={email}
          disabled
        />

        {/* Password */}
        <input
          type="password"
          className="w-full mb-2 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
        />

        <input
          type="password"
          className="w-full mb-4 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg bg-red-500 hover:bg-red-600 transition text-white disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isChanged || loading}
            className="px-4 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 transition text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
