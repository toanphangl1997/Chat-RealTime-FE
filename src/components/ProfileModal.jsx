import { useState, useEffect } from "react";
import http from "../api/axios";
import { toast } from "react-toastify";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User";

const ProfileModal = ({ isOpen, onClose, user, setUser }) => {
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(DEFAULT_AVATAR);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ===== INIT =====
  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || "");
      setPreview(user.avatar || DEFAULT_AVATAR);

      setAvatarFile(null);
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [user, isOpen]);

  // cleanup tránh leak memory
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!isOpen) return null;

  // ===== DERIVED STATE =====
  const isPasswordChanged = currentPassword && newPassword;

  const isChanged =
    avatarFile || name.trim() !== user.name || isPasswordChanged;

  const isDisabled = loading || !isChanged;

  // ===== AVATAR =====
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files are allowed", {
        toastId: "file-type",
      });
    }

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB", {
        toastId: "file-size",
      });
    }

    setAvatarFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleSubmit = async () => {
    // ===== VALIDATE (chỉ validate meaningful) =====

    if (!name.trim()) {
      return toast.error("Name cannot be empty", {
        toastId: "name-empty",
      });
    }

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return toast.error("Please fill both password fields", {
          toastId: "password-missing",
        });
      }

      if (newPassword.length < 6) {
        return toast.error("New password must be at least 6 characters", {
          toastId: "password-length",
        });
      }

      if (currentPassword === newPassword) {
        return toast.error(
          "New password must be different from current password",
          { toastId: "password-same" },
        );
      }
    }

    try {
      setLoading(true);

      let updatedUser = { ...user };
      const promises = [];

      // ===== API CALLS =====
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        promises.push(http.patch(`/users/${user.id}/avatar`, formData));
      }

      if (name.trim() !== user.name) {
        promises.push(http.patch(`/users/${user.id}`, { name: name.trim() }));
      }

      if (isPasswordChanged) {
        promises.push(
          http.post("/auth/change-password", {
            currentPassword,
            newPassword,
          }),
        );
      }

      const results = await Promise.all(promises);

      results.forEach((res) => {
        if (res?.data?.avatar) updatedUser = res.data;
        if (res?.data?.name) updatedUser.name = res.data.name;
      });

      // ===== PASSWORD FLOW =====
      if (isPasswordChanged) {
        toast.success("Password changed. Please login again", {
          toastId: "password-success",
        });

        localStorage.removeItem("token");
        sessionStorage.clear();

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);

        return;
      }

      // ===== NORMAL FLOW =====
      setUser(updatedUser);
      onClose();

      toast.success("Profile updated", {
        toastId: "profile-success",
      });
    } catch (err) {
      console.error(err); // interceptor handle
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-2xl w-80 shadow-xl">
        <h2 className="text-yellow-300 text-xl mb-4 text-center">
          {name || "User"}
        </h2>

        <div className="flex justify-center mb-4">
          <label className="cursor-pointer">
            <img
              src={preview}
              className="w-24 h-24 rounded-full object-cover"
            />
            <input type="file" hidden onChange={handleFileChange} />
          </label>
        </div>

        <input
          className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-2 p-2 bg-gray-700 text-gray-400 rounded"
          value={user.email}
          disabled
        />

        <input
          type="password"
          className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
        />

        <input
          type="password"
          className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-red-500 px-3 py-1 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="bg-blue-500 px-3 py-1 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
