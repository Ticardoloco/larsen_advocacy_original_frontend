import { api } from "@/lib/api";

interface Totals{
    NGN: string;
    USD: string
}

export interface DonateFundPayload{
    slug: string;
    label: string;
    blurb: string;
}

export interface DonateFundItems{
    _id: string;
    slug: string;
    label: string;
    blurb: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SingleDonateFundResponse{
    message: string;
    data: DonateFundItems;
}

export interface DonateFundResponse{
    message: string;
    count: number;
    data: DonateFundItems[];
}

export interface DonationTransactionPayload{
    donorName: string;
    email: string;
    amount: number;
    fund: string;
    currency: "NGN" | "USD";
}

export interface DonationTransactionItems{
    _id: string;
    donorName: string;
    email: string;
    amount: number;
    fund: string;
    currency: string;
    reference: string;
    checkoutId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface SingleDonationTransactionResponse{
    message: string;
    data: DonationTransactionItems;
}

export interface DonationTransactionResponse{
    message: string;
    count: number;
    totals: Totals;
    data: DonationTransactionItems[];
}

export interface DonorMessagePayload{
    donorName: string;
    message: string;
    advise: string;
}

export interface DonorMessageItems{
    _id: string;
    donorName: string;
    message: string;
    advise: string;
    createdAt: string;
    updatedAt: string;
};

export interface SingleDonorMessageResponse{
    message: string;
    data: DonorMessageItems
}

export interface DonorMessageResponse{
    message: string;
    count: number;
    data: DonorMessageItems[];
}


export const postDonateFund = async (payload: DonateFundPayload): Promise<SingleDonateFundResponse>=>{
    const {data} = await api.post("/donate", payload);
    return data;
}

export const getAllDonateFunds = async (): Promise<DonateFundResponse>=>{
    const {data} = await api.get<DonateFundResponse>("/donate");
    return data;
}

export const getDonateFundBySlug = async (slug: string): Promise<SingleDonateFundResponse>=>{
    const {data} = await api.get<SingleDonateFundResponse>(`/donate/${slug}`);
    return data;
}

export const updateDonateFund = async (id: string, payload: Partial<DonateFundPayload>): Promise<SingleDonateFundResponse>=>{
    const {data} = await api.put<SingleDonateFundResponse>(`/donate/${id}`, payload);
    return data;
}

export const deleteDonateFund = async (id: string) =>{
    const {data} = await api.delete(`/donate/${id}`);
    return data;
}

export const initializeDonation = async (payload: DonationTransactionPayload): Promise<SingleDonationTransactionResponse>=>{
    const {data} = await api.post<SingleDonationTransactionResponse>("/donations/initialize", payload);
    return data;
}

export const verifyDonations = async (reference: string): Promise<SingleDonationTransactionResponse>=>{
    const {data} = await api.get<SingleDonationTransactionResponse>(`/donations/verify/${reference}`);
    return data;
}

export const getAllDonationTransactions = async (): Promise<DonationTransactionResponse>=>{
    const {data} = await api.get<DonationTransactionResponse>("/donations");
    return data;
}

export const deleteDonationTransaction = async (id: string) =>{
    const {data} = await api.delete(`/donations/${id}`);
    return data;
}


export const postDonorMessage = async (payload: DonorMessagePayload): Promise<SingleDonorMessageResponse>=>{
    const {data} = await api.post<SingleDonorMessageResponse>("/donor-message", payload);
    return data;
}

export const getAllDonorMessages = async (): Promise<DonorMessageResponse> =>{
    const {data} = await api.get<DonorMessageResponse>("/donor-message");
    return data;
}

export const updateDonorMessage = async (id: string, payload: Partial<DonorMessagePayload>): Promise<SingleDonorMessageResponse>=>{
    const {data} = await api.put<SingleDonorMessageResponse>(`/donor-message/${id}`, payload);
    return data;
}

export const deleteDonorMessage = async (id: string)=>{
    const {data} = await api.delete(`/donor-message/${id}`);
    return data;
}

