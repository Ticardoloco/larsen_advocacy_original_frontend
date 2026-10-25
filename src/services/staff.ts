import { api } from "@/lib/api"; 

export interface StaffPayload{
    name: string;
    title: string;
    bio: string;
    image: string;
};

export interface StaffItems{
    _id: string;
    name: string;
    title: string;
    bio: string;
    image: string;
};

export interface SingleStaffResponse{
    message: string;
    data: StaffItems;
};
export interface StaffResponse{
    message: string;
    count: number;
    data: StaffItems[];
};

export const postStaff = async(payload: StaffPayload): Promise<SingleStaffResponse>=>{
    const {data} = await api.post<SingleStaffResponse>("/staff", payload);
    return data;
};

export const getAllStaff = async (): Promise<StaffResponse>=>{
    const {data} = await api.get<StaffResponse>("/staff");
    return data;
};

export const updateStaff = async (id: string, payload: StaffPayload): Promise<SingleStaffResponse>=>{
    const {data}= await api.put<SingleStaffResponse>(`/staff/${id}`, payload);
    return data;
}

export const deleteStaff = async (id: string)=>{
    const {data} = await api.delete(`/staff/${id}`);
    return data;
}