import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import { logoutUserThunk } from "../../slices/Authslice";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../slices/Authslice";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logoutUserThunk());
    dispatch(clearAuth())
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome, {user?.name}</h1>
        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;