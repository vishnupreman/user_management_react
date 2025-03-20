import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { loginUser } from "../../slices/Authslice";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../../slices/adminSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard')
    }
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await dispatch(loginUser({ email, password }) as any);

    if (response.payload?.user?.isAdmin) {
      await dispatch(fetchUsers());
      navigate("/admin/dashboard");
    } else {
      alert("Access Denied: Not an Admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-black">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-gray-900"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg hover:bg-yellow-600 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
