const API_URL = "http://localhost:5000/api/auth";
import { User } from "../types/user";


export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  isAdmin: boolean;
}


export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

const handleApiError = async (response: Response) => {
  const errorData = await response.json();
  throw new Error(errorData.message || "API request failed");
};


export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) await handleApiError(response);

    const data: AuthResponse = await response.json();

    console.log(data,'data from the auth.ts')
    setAccessToken(data.accessToken);

    return data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error; 
  }
};


export const registerUserApi = async (
  formData: FormData
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) await handleApiError(response);

    const data: AuthResponse = await response.json();
    setAccessToken(data.accessToken);

    return data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};


export const logout = async () => {
  try {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};


export const refreshAccessToken = async (): Promise<{
  accessToken: string;
  isAdmin: boolean;
}> => {
  try {
    const response = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) await handleApiError(response);

    const data: { accessToken: string; isAdmin: boolean } =
      await response.json();

    console.log(data, 'data from refresh access token function')
    setAccessToken(data.accessToken);
    localStorage.setItem("isAdmin", JSON.stringify(data.isAdmin));

    return data;
  } catch (error) {
    console.error("Refresh Token Error:", error);
    throw error; 
  }
};
