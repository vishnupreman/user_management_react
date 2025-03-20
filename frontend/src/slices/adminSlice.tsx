import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../types/user";
import axiosInstance from "../api/axiosInstance";
import { logoutUserThunk } from "./Authslice";

interface AdminState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  loading: false,
  error: null,
};

const API_URL = "http://localhost:5000/api/admin";


const handleApiError = (error: any) => {
  console.error("API Error:", error.response?.data || error.message);
  return error.response?.data?.message || "Something went wrong";
};

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/users`);
      console.log("Fetched Users: ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);


export const updateUser = createAsyncThunk<User, { id: string; userData: Partial<User> }, { rejectValue: string }>(
  "admin/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      console.log("Updating User Data: ", id, userData);

      const response = await axiosInstance.put(`${API_URL}/users/${id}`, userData);

      console.log("Update Response: ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_URL}/users/${id}`);
      return id; // Return deleted user ID for local removal
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);


export const logoutAdmin = createAsyncThunk<void, void, { rejectValue: string }>(
  "admin/logoutAdmin",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post(`${API_URL}/logout`);
      dispatch(logoutUserThunk()); 
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);


const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update User
    builder.addCase(updateUser.fulfilled, (state, action) => {
      console.log("Redux Updated User: ", action.payload);
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
    });

    // Delete User
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    });

    // Admin Logout (Clear Admin State)
    builder.addCase(logoutAdmin.fulfilled, (state) => {
      state.users = [];
      state.error = null;
    });
  },
});

export default adminSlice.reducer;
