import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, logout as apiLogout, refreshAccessToken, registerUserApi } from '../api/auth';
import { User } from '../types/user';
import { safeParseJSON } from '../utility/safeParse';
import { decodeJwt } from '../utility/decodeJwt';


interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}


interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  image: File;
}


const STORAGE_KEYS = {
  user: 'user',
  accessToken: 'accessToken',
};


const saveToLocalStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};


const removeFromLocalStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};


const storedUser = safeParseJSON<User | null>(localStorage.getItem(STORAGE_KEYS.user), null);
const storedAccessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
const decodedToken = storedAccessToken ? decodeJwt<{ isAdmin: boolean }>(storedAccessToken) : null;

const initialState: AuthState = {
  user: storedUser,
  accessToken: storedAccessToken,
  isAuthenticated: !!storedAccessToken,
  isAdmin: decodedToken?.isAdmin || false,
  loading: false,
};


export const loginUser = createAsyncThunk<
  { user: User; accessToken: string },
  { email: string; password: string }
>('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await login(email, password);
    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return rejectWithValue('Login failed');
  }
});


export const registerUser = createAsyncThunk<
  { user: User; accessToken: string },
  RegisterPayload
>('auth/registerUser', async ({ name, email, password, image }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('image', image);

    const response = await registerUserApi(formData);
    return response;
  } catch (error) {
    console.error('Registration Error:', error);
    return rejectWithValue('Registration failed');
  }
});

export const logoutUserThunk = createAsyncThunk('auth/logoutUserThunk', async () => {
  try {
    await apiLogout();
  } catch (error) {
    console.error('Logout Error:', error);
  } finally {
    removeFromLocalStorage();
  }
});


export const refreshToken = createAsyncThunk<string, void, { rejectValue: string }>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const { accessToken } = await refreshAccessToken();
      return accessToken; 
    } catch (error) {
      console.error('Token Refresh Error:', error);
      return rejectWithValue('Token refresh failed');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    setAccessToken: (state, action: PayloadAction<string>) => {
      const accessToken = action.payload;
      const decoded = decodeJwt<{ isAdmin: boolean }>(accessToken);

      if (!decoded) return;

      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.isAdmin = decoded.isAdmin || false;

      saveToLocalStorage(STORAGE_KEYS.accessToken, accessToken);
    },


    clearAuth: (state) => {
      Object.assign(state, initialState);
      removeFromLocalStorage();
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        const { user, accessToken } = payload;
        const decoded = decodeJwt<{ isAdmin: boolean }>(accessToken);

        state.user = user;
        state.accessToken = accessToken;
        state.isAuthenticated = true;
        state.isAdmin = decoded?.isAdmin || false;
        state.loading = false;

        saveToLocalStorage(STORAGE_KEYS.user, user);
        saveToLocalStorage(STORAGE_KEYS.accessToken, accessToken);
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        const { user, accessToken } = payload;
        const decoded = decodeJwt<{ isAdmin: boolean }>(accessToken);

        state.user = user;
        state.accessToken = accessToken;
        state.isAuthenticated = true;
        state.isAdmin = decoded?.isAdmin || false;
        state.loading = false;

        saveToLocalStorage(STORAGE_KEYS.user, user);
        saveToLocalStorage(STORAGE_KEYS.accessToken, accessToken);
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(logoutUserThunk.rejected, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        const decoded = decodeJwt<{ isAdmin: boolean }>(payload);

        state.accessToken = payload;
        state.isAuthenticated = true;
        state.isAdmin = decoded?.isAdmin || false;

        saveToLocalStorage(STORAGE_KEYS.accessToken, payload);
      })
      .addCase(refreshToken.rejected, (state) => {
        Object.assign(state, initialState);
        removeFromLocalStorage();
      });
  },
});



export const { setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;