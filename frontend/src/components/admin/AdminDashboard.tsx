import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import { fetchUsers, deleteUser, logoutAdmin } from "../../slices/adminSlice";
import { useNavigate } from "react-router-dom";
import EditUserModal from "./EditUserModal"; 

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { users, loading } = useAppSelector((state) => state.admin);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(id));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-900 shadow-lg rounded-lg overflow-hidden text-white">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Admin</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.isAdmin ? "Yes" : "No"}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => setEditUserId(user._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

     
      {editUserId && (
        <EditUserModal
          user={users.find((user) => user._id === editUserId)!}
          onClose={() => setEditUserId(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
