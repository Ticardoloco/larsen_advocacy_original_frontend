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

export const postStaff = async (payload: StaffPayload): Promise<SingleStaffResponse> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("title", payload.title);
    formData.append("bio", payload.bio);
    if (payload.image) {
      formData.append("image", payload.image);
    }

    const { data } = await api.post<SingleStaffResponse>("/staff", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

export const getAllStaff = async (): Promise<StaffResponse>=>{
    const {data} = await api.get<StaffResponse>("/staff");
    return data;
};

export const updateStaff = async (id: string, payload: StaffPayload): Promise<SingleStaffResponse> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("title", payload.title);
    formData.append("bio", payload.bio);
    if (payload.image) {
      formData.append("image", payload.image);
    }

    const { data } = await api.put<SingleStaffResponse>(`/staff/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

export const deleteStaff = async (id: string)=>{
    const {data} = await api.delete(`/staff/${id}`);
    return data;
}