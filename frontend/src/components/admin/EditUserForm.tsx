import { useState } from "react";
import { useAppDispatch } from "../../Hooks/reduxHooks"; 
import {updateUser } from "../../slices/adminSlice"; 
import { User } from "../../types/user";

interface EditUserFormProps {
  user: User;
  onClose: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUser({ id: user._id, userData: formData }));
    onClose(); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Edit User</h2>

      <div>
        <label className="block">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <div>
        <label className="block">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={handleChange}
          />
          Is Admin
        </label>
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save Changes
      </button>

      <button
        type="button"
        onClick={onClose}
        className="ml-4 bg-gray-500 text-white p-2 rounded"
      >
        Cancel
      </button>
    </form>
  );
};

export default EditUserForm;
