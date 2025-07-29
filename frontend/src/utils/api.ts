import axios from "axios";

// const API_BASE_URL = "https://highway-delite-task-4na6.onrender.com/api";
const API_BASE_URL = "https://highway-delite-task-4na6.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { data?: { error?: string; message?: string } };
    };
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
  }

  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }

  return "An unexpected error occurred";
};

export const authAPI = {
  register: (userData: { name: string; email: string; dateOfBirth: string }) =>
    api.post("/auth/register", userData),

  verifyOTP: (email: string, otp: string) =>
    api.post("/auth/verify-otp", { email, otp }),

  sendOTP: (email: string) => api.post("/auth/send-otp", { email }),

  login: (email: string) => api.post("/auth/login", { email }),
};

export const notesAPI = {
  getNotes: () => api.get("/notes"),
  createNote: (title: string, content: string) =>
    api.post("/notes", { title, content }),
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
};

export default api;
