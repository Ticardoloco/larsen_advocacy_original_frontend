import {api} from "@/lib/api";

export interface SupportPayload{
    category: string;
    urgency: "standard" | "high" | "critical";
    message: string;
    isAnonymous: boolean;
    fullName?: string;
    email?: string;
    phone?: string;
}

export interface SupportItem{
    _id: string;
    category: string;
    urgency: "standard" | "high" | "critical";
    message: string;
    isAnonymous: boolean;
    fullName?: string;
    email?: string;
    phone?: string;
    createdAt: string;
}
export interface SingleSupportResponse{
    message: string;
    data: SupportItem;
}

export interface GetSupportResponse{
    message: string;
    count: number;
    data: SupportItem[];
}

export const postSupport = async (payload: SupportPayload): Promise<SingleSupportResponse> => {
    const {data} = await api.post<SingleSupportResponse>("/support", payload);
    return data;
}

export const getSupport = async (): Promise<GetSupportResponse> => {
    const {data} = await api.get<GetSupportResponse>("/support");
    return data;
}

export const deleteSupport = async (id: string): Promise<SingleSupportResponse> => {
    const {data} = await api.delete<SingleSupportResponse>(`/support/${id}`);
    return data;
}
