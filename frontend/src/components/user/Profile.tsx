import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Hooks/reduxHooks";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  console.log("User from Redux:", user);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Profile Page</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center w-96">
        {user?.image && (
          <img
            src={`http://localhost:5000${user.image}`}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mb-6 border-4 border-gray-600"
          />
        )}
        <p className="text-xl mb-4"> <strong>Name:</strong> {user.name} </p>
        <p className="text-xl mb-6"> <strong>Email:</strong> {user.email} </p>
        <button
          onClick={() => navigate("/home")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Profile;
