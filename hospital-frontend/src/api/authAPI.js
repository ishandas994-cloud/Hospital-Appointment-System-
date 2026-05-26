import API from "./axios";

// Register User
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

// Get Current User
export const getCurrentUser = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

// Logout User
export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};