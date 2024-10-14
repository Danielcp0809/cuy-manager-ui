import axios from "axios";
import { API_URL } from "../shared/constants";
import { IAuthResponse } from "../interfaces/api/auth-enterprise.interface";

export const api = axios.create({
  baseURL: API_URL,
});

export const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const login = async (username: string, password: string) => {
  const response = await axios.post<IAuthResponse>(`${API_URL}/auth/login`, {
    username,
    password,
  });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, {
    email,
  });
  return response.data;
};

export const verifyCode = async (email: string, code: string) => {
  const response = await axios.post(`${API_URL}/auth/verify-code`, {
    email,
    code,
  });
  return response.data;
}

export const resetPassword = async (email: string, code: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, {
    code,
    email,
    password,
  });
  return response.data;
}
