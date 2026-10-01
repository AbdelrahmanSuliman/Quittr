import { api } from "@/lib/axios";

export interface SignupData {
  email: string;
  username: string;
  password: string;
}
export interface SignupResponse {
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      username: string;
    };
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      username: string;
    };
  };
}
export const signup = async (data: SignupData): Promise<SignupResponse> => {
  const response = await api.post("/auth/signup", data);

  return response.data;
};

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
