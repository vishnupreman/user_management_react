import React, { useState } from "react";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { updateUser } from "../../slices/adminSlice";
import { User } from "../../types/user";
import { fetchUsers } from "../../slices/adminSlice";

interface EditUserModalProps {
  user: User;
  onClose: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose }) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateUser({ id: user._id, userData: { name, email, isAdmin } }));
    dispatch(fetchUsers());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl mb-4 font-semibold">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="mr-2 accent-blue-500"
              />
              Admin Access
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
