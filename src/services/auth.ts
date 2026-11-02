import { api } from "@/lib/api";

interface Address{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface RegisterAdminPayload{
  email: string;
  password?: string;
  role?: "admin" | "super-admin";
  fullName?: string;
  gender?: string;
  phoneNumber?: string;
  address?: Address;
  isSuspended?: boolean;
  suspensionReason?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: string | null;
}
export interface LoginPayload {
    email: string;
    password: string;
}

export interface ChangePasswordPayload{
  currentPassword: string;
  newPassword: string;
}


export interface User {
  role: "admin" | "super-admin";
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

export interface RegisterAdminResponse{
  message: string;
  user: User;
}

export interface AllUserResponse{
  message: string;
  count: number;
  users: User[];
}

export const registerAdmin = async (payload: RegisterAdminPayload): Promise<RegisterAdminResponse>=>{
  const {data} = await api.post<RegisterAdminResponse>("/users/register-admin", payload);
  return data;
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

export const getCurrentUser = async (): Promise<RegisterAdminResponse>=>{
  const {data} = await api.get<RegisterAdminResponse>("/users/profile");
  return data;
}

export const updateCurrentUser = async (payload: Partial<RegisterAdminPayload>): Promise<RegisterAdminResponse>=>{
  const {data} = await api.put<RegisterAdminResponse>("/users/profile", payload);
  return data;
}

export const changeUserPassword = async (payload: ChangePasswordPayload)=>{
  const {data} = await api.put("/users/change-password", payload);
  return data;
}

export const deleteCurrentUser = async ()=>{
  const {data} = await api.delete("/users/profile");
  return data;
}

export const getAllUsers = async (): Promise<AllUserResponse>=>{
  const {data} = await api.get<AllUserResponse>("/users/profiles");
  return data;
}

export const suspendUser = async (id: string, payload: Partial<RegisterAdminPayload>) =>{
  const {data} = await api.patch(`/users/suspend/${id}`, payload);
  return data;
}

export const updateUserRole = async (id: string, payload: Partial<RegisterAdminPayload>)=>{
  const {data} = await api.patch(`/users/role/${id}`, payload);
  return data
}

export const deleteUser = async (id: string)=>{
  const {data} = await api.delete(`/users/user/${id}`);
  return data;
}