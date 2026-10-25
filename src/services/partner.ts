import { api } from "@/lib/api";

export interface PartnerPayload {
    organisationName: string;
    contactPerson: string;
    email: string;
    howWouldYouLikeToPartner: string;
}

export interface PartnerItems{
    _id: string;
    organisationName: string;
    contactPerson: string;
    email: string;
    howWouldYouLikeToPartner: string;
    createdAt: string;
    updatedAt: string;
}

export interface SinglePartnerResponse{
    message: string;
    data: PartnerItems
}

export interface PartnerResponse{
    message: string;
    count: number;
    data: PartnerItems[];
}

export const postPartner = async (payload: PartnerPayload): Promise<SinglePartnerResponse>=>{
    const {data} = await api.post<SinglePartnerResponse>('/partnerships', payload);
    return data;
}

export const getAllPartners = async (): Promise<PartnerResponse>=>{
    const {data} = await api.get<PartnerResponse>("partnerships");
    return data;
}

export const deletePartner = async (id: string)=>{
    const {data} = await api.delete(`/partnerships/${id}`);
    return data;
}