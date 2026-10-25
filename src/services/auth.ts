import { api } from "@/lib/api";

export interface LoginPayload {
    email: string;
    password: string;
}
interface Address{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  gender?: string;
  phoneNumber?: string;
  address?: Address;
  isSuspended: boolean;
  suspensionReason?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse>=>{
    const {data} = await api.post("/users/login", payload);
    if (data.token && typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
    }
    return data;
};

export const logoutUser = () => {
   if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  }
}